import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import logo from "/logo.png";
import { motion } from "framer-motion"; // Importando motion

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();

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

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetPasswordMessage("");

    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      setResetPasswordMessage("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      let errorMessage = "Erro ao enviar o e-mail de recuperação. Tente novamente.";

      if (err.code === "auth/user-not-found") {
        errorMessage = "Nenhum usuário encontrado com esse e-mail.";
      }

      setResetPasswordMessage(errorMessage);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0E0F11] items-center justify-center p-4">
      <div className="flex justify-center mb-8">
        <img src={logo} alt="Logo" className="w-auto h-36" />
      </div>

      <h2 className="text-slate-100 mb-8 font-semibold tracking-widest text-2xl text-center">Treine para ser um campeão!</h2>

      {/* Contêiner de login com altura fixa */}
      <motion.div
        className="flex flex-col items-center w-full max-w-md px-4 h-[500px] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {!isResetPassword ? (
          <motion.form
            className="flex flex-col gap-6 w-full"
            onSubmit={handleLogin}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-4 w-full">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 pl-10 bg-transparent text-white border-b-2 border-gray-600 outline-none"
                required
              />
            </div>

            <div className="relative mb-4 w-full">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full p-2 pl-10 bg-transparent text-white border-b-2 border-gray-600 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md font-medium text-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </motion.form>
        ) : (
          <motion.form
            className="flex flex-col gap-4 w-full"
            onSubmit={handlePasswordReset}
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-4 w-full">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={resetPasswordEmail}
                onChange={(e) => setResetPasswordEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full p-2 pl-10 bg-transparent text-white border-b-2 border-gray-600 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-yellow-500 text-white rounded-md font-medium text-sm transition duration-200 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Recuperar Senha
            </button>

            {resetPasswordMessage && <div className="mt-4 text-white text-sm">{resetPasswordMessage}</div>}

            <button
              type="button"
              onClick={() => setIsResetPassword(false)}
              className="w-full py-2 mt-1 bg-transparent text-gray-500 rounded-md font-medium text-sm transition duration-200 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Voltar
            </button>
          </motion.form>
        )}

        {!isResetPassword && (
          <motion.button
            type="button"
            onClick={() => setIsResetPassword(true)}
            className="w-full py-2 mt-3 bg-transparent text-yellow-500 rounded-md font-medium text-sm transition duration-200 hover:bg-yellow-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Esqueceu a senha?
          </motion.button>
        )}

        <button
          onClick={goToRegister}
          className="w-full py-2 mt-4 bg-transparent text-blue-500 rounded-md font-medium text-sm transition duration-200 hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Criar Conta
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
