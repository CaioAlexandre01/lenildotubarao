import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // Importa a função de login
import { auth } from "../../firebase/firebaseConfig"; // Importa o auth
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Ícones do react-icons
import logo from "/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/esconder a senha
  const navigate = useNavigate(); // hook para navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique seu e-mail.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta. Tente novamente.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "O e-mail fornecido é inválido.";
      }

      setError(errorMessage); // Define a mensagem de erro personalizada
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0E0F11] items-center justify-center p-4">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img
          src={logo} // Substitua pelo caminho real da sua logo
          alt="Logo"
          className="w-auto h-36"
        />
      </div>

      {/* Descrição */}
      <h2 className="text-slate-100 mb-8 font-semibold tracking-widest text-2xl text-center">Treine para ser um campeão!</h2>

      {/* Formulário de Login */}
      <div className="flex flex-col items-center w-full max-w-md px-4">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form className="flex flex-col gap-6 w-full" onSubmit={handleLogin}>
          {/* Campo de Email */}
          <div className="relative mb-4 w-full">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 pl-10 bg-transparent text-white border-b-2 border-gray-600 outline-none" required />
          </div>

          {/* Campo de Senha */}
          <div className="relative mb-4 w-full ">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full p-2 pl-10 bg-transparent text-white border-b-2 border-gray-600 outline-none" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Botão de Login */}
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md font-medium text-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Botão de Criar Conta */}
        <button onClick={goToRegister} className="w-full py-2 mt-4 bg-transparent text-blue-500 rounded-md font-medium text-sm transition duration-200 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          Criar Conta
        </button>
      </div>
    </div>
  );
};

export default Login;
