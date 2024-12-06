import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig"; // Importa a configuração do Firebase
import { collection, getDocs } from "firebase/firestore"; // Funções do Firestore
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importando autenticação do Firebase
import { useNavigate } from "react-router-dom"; // Para redirecionamento de navegação
import { IoMdCloseCircle } from "react-icons/io"; // Ícone de X mais estilizado

const PageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Para controle do dropdown
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
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList); // Atualiza o estado com a lista de usuários
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
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
        <motion.div
          className="text-center p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
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
    <motion.div
      className="min-h-screen bg-[#0E0F11] text-white p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Painel de Administração</h2>

      {users.length === 0 ? (
        <p className="text-center text-gray-400">Nenhum usuário registrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={index}
              onClick={() => toggleDropdown(index)} // Ação para mostrar/esconder dropdown ao clicar no contêiner
              className="bg-[#1A1C22] rounded-lg shadow-lg p-5 hover:bg-gray-700 transition duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-xl font-semibold text-gray-300">
                {user.fullName}
                {/* Ícone mais estilizado (X ou Check) */}
                <IoMdCloseCircle className="text-red-500" size={24} />
              </div>

              {/* Exibindo o apelido como subtítulo */}
              <h3 className="text-lg text-gray-400 font-medium mt-2">{user.nickname}</h3>

              {/* Dropdown com as informações adicionais */}
              {activeIndex === index && (
                <motion.div
                  className="mt-3 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
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
