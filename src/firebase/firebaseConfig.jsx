// Importar funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth"; // Importar o Auth e signOut
import { getFirestore } from "firebase/firestore"; // Importar o Firestore

// Configuração do Firebase (usando os dados que você forneceu)
const firebaseConfig = {
  apiKey: "AIzaSyDbpFDslqeZvwM451zE-u35S8eJi9IOLro",
  authDomain: "tubaraomanager-126f6.firebaseapp.com",
  projectId: "tubaraomanager-126f6",
  storageBucket: "tubaraomanager-126f6.firebasestorage.app",
  messagingSenderId: "40233872698",
  appId: "1:40233872698:web:dd085655beaea34f60f403"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Auth (autenticação) e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para uso em outros arquivos
export { auth, db, firebaseSignOut };
