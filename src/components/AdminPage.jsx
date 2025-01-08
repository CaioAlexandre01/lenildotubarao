import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig"; // Importa a configuração do Firebase
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Funções do Firestore
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Importando autenticação do Firebase
import { useNavigate } from "react-router-dom"; // Para redirecionamento de navegação
import { IoMdCloseCircle, IoMdCheckmarkCircle } from "react-icons/io"; // Ícone de X mais estilizado

const PageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Para controle do dropdown
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
  const navigate = useNavigate(); // Hook de navegação do react-router-dom

  // Verifica o estado da autenticação do usuário
  const checkAuthentication = () => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Usuário autenticado
      } else {
        setIsAuthenticated(false); // Usuário não autenticado
        navigate("/"); // Redireciona para a página de login
      }
    });

    return unsubscribe;
  };

  // Busca os dados dos usuários no Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "data-users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        paymentDate: doc.data().paymentDate, // Aqui estamos pegando a data de pagamento
      }));

      // Filtra os usuários para excluir os que são admin
      const filteredUsers = usersList.filter(user => user.role !== "admin"); // Exclui os usuários com role "admin"

      setUsers(filteredUsers); // Atualiza o estado com a lista de usuários filtrada
      setFilteredUsers(filteredUsers); // Inicialmente, a lista filtrada é a mesma
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para atualizar o status de pagamento
  const handleConfirmPayment = async (userId) => {
    try {
      const userRef = doc(db, "data-users", userId);
      await updateDoc(userRef, {
        paymentStatus: "concluído", // Atualiza o status para concluído
      });
      alert("Pagamento confirmado!");
      fetchUsers(); // Atualiza a lista de usuários após a confirmação
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      alert("Erro ao confirmar pagamento.");
    }
  };

  // Função para logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Realiza o logout
      navigate("/"); // Redireciona para a página de login
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
    }
  };

  // Função para filtrar usuários com base no termo de busca
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    // Filtra os usuários pelo nome ou apelido
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(term) || user.nickname.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered); // Atualiza os usuários filtrados
  };

  // useEffect para verificar a autenticação
  useEffect(() => {
    const unsubscribe = checkAuthentication(); // Verifica se o usuário está autenticado
    return () => unsubscribe(); // Limpeza do efeito
  }, [navigate]);

  // useEffect para buscar os usuários apenas quando estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers(); // Busca usuários no Firestore
    }
  }, [isAuthenticated]); // Dependência de autenticação

  // Renderização condicional para carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <motion.div className="text-center p-6 bg-white rounded-lg shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="text-lg font-semibold text-gray-700">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  // Função para alternar o dropdown
  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Alterna a visibilidade do dropdown
  };

  return (
    
    <motion.div className="min-h-screen bg-[#0E0F11] text-white p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* Botão de logout */}
            <motion.div className="w-full flex justify-end py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white rounded-full text-sm shadow-md hover:bg-red-600 transition duration-300"
        >
          Sair
        </button>
      </motion.div>
      <h2 className="text-2xl font-semibold text-center mb-6">Painel de Administração</h2>

      {/* Barra de Pesquisa */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou apelido"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 bg-[#1A1C22] text-white rounded-lg shadow-md border border-gray-600"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={index}
              onClick={() => toggleDropdown(index)} // Ação para mostrar/esconder dropdown ao clicar no contêiner
              className="bg-[#1A1C22] rounded-lg shadow-lg p-3 hover:bg-gray-700 transition duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-base font-semibold text-gray-300">
                {user.fullName}
                {/* Ícone de pagamento */}
                {user.paymentStatus === "concluído" ? <IoMdCheckmarkCircle className="text-green-500" size={24} /> : <IoMdCloseCircle className="text-red-500" size={24} />}
              </div>

              {/* Exibindo o apelido como subtítulo */}
              <h3 className="text-sm text-gray-400 font-medium ">({user.nickname})</h3>

              {/* Exibindo a data de pagamento */}
              {user.paymentDate && <p className="text-sm text-gray-400 mt-1">Último pagamento: {user.paymentDate}</p>}

              {/* Botão de Confirmar Pagamento, fora do dropdown e abaixo do apelido */}
              {user.paymentStatus === "aguardando" && (
                <button
                  onClick={() => handleConfirmPayment(user.id)} // Confirma pagamento ao clicar
                  className="mt-4 py-2 px-6 bg-green-500 text-white rounded-full text-sm shadow-md hover:bg-green-600 transition duration-300"
                >
                  Confirmar Pagamento
                </button>
              )}

              {/* Dropdown com as informações adicionais */}
              {activeIndex === index && (
                <motion.div className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <p className="text-sm text-gray-400">Email: {user.email}</p>
                  <p className="text-sm text-gray-400">Faixa: {user.belt}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PageAdmin;
