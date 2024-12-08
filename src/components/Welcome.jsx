import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig"; // Importando apenas o auth do Firebase
import { signOut } from "firebase/auth"; // Importando diretamente o signOut do Firebase
import { useNavigate } from "react-router-dom"; // Para navegação
import { db } from "../firebase/firebaseConfig"; // Importando o Firestore
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Função para pegar dados do Firestore e atualizar
import { motion } from "framer-motion"; // Importando o Framer Motion

const Welcome = () => {
  const [user, setUser] = useState(null); // Armazenará os dados do usuário
  const [nickname, setNickname] = useState(""); // Armazenará o apelido do usuário
  const [phone, setPhone] = useState(""); // Armazenará o número de telefone do usuário
  const [currentDate, setCurrentDate] = useState(""); // Para armazenar a data atual
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Estado para controle do pagamento
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Estado para controlar a desabilitação do botão
  const [paymentDate, setPaymentDate] = useState(""); // Estado para armazenar a data de pagamento
  const navigate = useNavigate(); // Para navegação

  useEffect(() => {
    // Verifica se há um usuário logado
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Define o usuário logado

        // Recupera os dados do usuário do Firestore
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "data-users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setNickname(userData.nickname);
              setPhone(userData.phone);
              setPaymentDate(userData.paymentDate || "Não informado"); // Atualiza a data de pagamento

              // Verifica se o pagamento já passou de 30 dias
              if (userData.paymentDate) {
                const paymentDate = new Date(userData.paymentDate.split("/").reverse().join("-")); // Converte data de pagamento (dd/mm/yyyy) para formato Date
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - paymentDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Converte a diferença para dias

                if (diffDays > 30) {
                  await updateDoc(userDocRef, {
                    paymentStatus: "pendente", // Altera status para pendente se passaram mais de 30 dias
                  });
                } else {
                  if (userData.paymentStatus === "concluído") {
                    setPaymentConfirmed(true);
                    setIsButtonDisabled(true);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchUserData();
      } else {
        navigate("/"); // Redireciona para a página de login se não estiver logado
        setLoading(false); // Se o usuário não estiver logado, também termina o carregamento
      }
    });

    // Atualiza a data atual
    const today = new Date();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`; // Formata como "dd/mm/yyyy"
    setCurrentDate(formattedDate);

    return () => unsubscribe(); // Limpa a assinatura quando o componente é desmontado
}, [navigate]);


  const handleLogout = async () => {
    try {
      await signOut(auth); // Faz o logout do usuário
      navigate("/"); // Redireciona para a página de login após o logout
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
    }
  };

  const handlePayment = async () => {
    setPaymentConfirmed(true); // Marca o pagamento como confirmado
    setIsButtonDisabled(true); // Desabilita o botão após confirmação
    
    // Agora formatamos a data para "dd/mm/yyyy" antes de salvar
    const formattedPaymentDate = currentDate; // A data já foi formatada no useEffect

    // Atualiza o status de pagamento no Firestore
    const userRef = doc(db, "data-users", user.uid);
    try {
      await updateDoc(userRef, {
        paymentStatus: "aguardando", // Atualiza o status para "aguardando"
        paymentDate: formattedPaymentDate, // Aqui é onde estamos usando a data formatada
      });

      // Atualiza o estado do paymentDate para a data de pagamento confirmada
      setPaymentDate(formattedPaymentDate); // Atualiza o estado para exibir a data

      console.log("Status de pagamento atualizado para 'aguardando' e paymentDate com a data correta.");
    } catch (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
    }
};


  // Renderiza um carregando enquanto as informações não estão prontas
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <motion.div className="text-center p-6 bg-white rounded-lg shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-lg font-semibold text-gray-700">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Não renderiza nada até que o usuário esteja carregado
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <motion.div className="text-center p-6 bg-white rounded-lg shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.h1 className="text-2xl font-bold text-gray-700" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          Bem-vindo, {nickname || "Usuário"}!
        </motion.h1>
        <p className="text-gray-500 mt-2">Você está logado como {user.email}</p>

        {/* Exibe a data de pagamento */}
        {paymentDate && (
          <motion.p className="mt-4 text-gray-700 font-semibold" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            Último pagamento: {paymentDate === "Não informado" ? "Não informado" : paymentDate}
          </motion.p>
        )}

        {/* Botão de Confirmar Pagamento */}
        <button
          onClick={handlePayment}
          disabled={isButtonDisabled} // Desabilita o botão quando isButtonDisabled for true
          className={`mt-4 py-2 px-6 ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"} text-white rounded-full text-sm shadow-md transition duration-300`}
        >
          Confirmar Pagamento
        </button>

        {/* Exibe a mensagem de pagamento confirmado */}
        {paymentConfirmed && (
          <motion.p className="mt-4 text-green-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            Pagamento confirmado. Oss!
          </motion.p>
        )}
      </motion.div>

      {/* Botão de logout posicionado no canto inferior direito */}
      <motion.div className="absolute bottom-10 right-10" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <button onClick={handleLogout} className="py-2 px-6 bg-red-500 text-white rounded-full text-sm shadow-md hover:bg-red-600 transition duration-0.3">
          Sair
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
