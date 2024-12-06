import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'; // Configuração do Firebase
import { db } from '../firebase/firebaseConfig';  // Acesso ao Firestore
import { doc, getDoc } from 'firebase/firestore'; // Funções para buscar dados do Firestore

const PrivateRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // Estado para armazenar a role do usuário
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento
  const user = auth.currentUser; // Verifica o usuário logado

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "data-users", user.uid); // Referência ao documento do usuário
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role); // Armazena a role do usuário
            console.log("User role from Firestore:", userData.role); // Log do valor da role
          }
        } catch (error) {
          console.error("Erro ao buscar a role do usuário:", error);
        } finally {
          setLoading(false); // Atualiza para não estar mais em carregamento
        }
      } else {
        setLoading(false); // Caso o usuário não esteja logado, também para o carregamento
      }
    };

    fetchUserRole();
  }, [user]);

  // Se o usuário não está logado, redireciona para a página de login
  if (loading) {
    return <div>Loading...</div>; // Pode ser um componente de carregamento
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  // Se a role for 'admin', redireciona para a página de admin
  if (userRole === 'admin') {
    return <Navigate to="/admin" />;
  }

  // Caso contrário, renderiza o conteúdo da rota (children)
  return children;
};

export default PrivateRoute;
