// PageAdmin.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";  // Certifique-se de importar a configuração correta do Firebase
import { collection, getDocs } from "firebase/firestore";  // Funções do Firestore
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth";  // Importando autenticação do Firebase
import { useNavigate } from "react-router-dom";  // Para redirecionar para a página de login

const PageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Hook de navegação do react-router-dom

  // Verificando se o usuário está autenticado
  useEffect(() => {
    const auth = getAuth();
    
    // Verificar o estado da autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);  // Usuário autenticado
      } else {
        setIsAuthenticated(false); // Usuário não autenticado
        navigate("/"); // Redireciona para a página de login
      }
    });

    // Limpeza do efeito
    return () => unsubscribe();
  }, [navigate]);

  // Função para buscar os usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "data-users"));
        const usersList = querySnapshot.docs.map((doc) => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Se estiver carregando, exibe um indicador de carregamento
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
        <table className="table-auto w-full text-left text-sm text-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2">Nome Completo</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Apelido</th>
              <th className="px-4 py-2">Faixa</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="px-4 py-2">{user.fullName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.nickname}</td>
                <td className="px-4 py-2">{user.belt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default PageAdmin;
