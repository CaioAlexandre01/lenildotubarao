import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [belt, setBelt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Aqui você define o papel do usuário (role)
      const userData = {
        fullName,
        nickname,
        birthYear,
        birthMonth,
        birthDay,
        belt,
        email,
        uid: user.uid,
        role: "student", // Definindo o papel como 'student' (ou pode ser 'admin' para admins)
      };
  
      // Salva os dados no Firestore
      await setDoc(doc(db, "data-users", user.uid), userData);
  
      alert("Cadastro realizado com sucesso!");
      navigate("/"); // Pode redirecionar para uma página específica, como a página de login
    } catch (err) {
      setError(err.message); // Exibe a mensagem de erro do Firebase
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    navigate("/");
  };

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1930; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonths = () => {
    return [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  };

  const generateDays = () => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      days.push(day);
    }
    return days;
  };

  return (
    <motion.div 
      className="h-auto w-screen p-5 border-none rounded-lg shadow-lg bg-[#0E0F11] overflow-hidden flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl text-center mb-4 text-slate-200 font-semibold">Cadastro de Aluno</h2>
      <form onSubmit={handleRegister} className="w-full max-w-md">
        {/* Nome Completo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="fullName" className="text-slate-200">Nome Completo</label>
          <input 
            type="text"
            id="fullName"
            className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 mb-4 focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </motion.div>

        {/* Apelido */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="nickname" className="text-slate-200">Apelido do Atleta</label>
          <input 
            type="text"
            id="nickname"
            className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 mb-4 focus:outline-none"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </motion.div>

        {/* Data de Nascimento */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label className="text-slate-200">Data de Nascimento</label>
          <div className="flex space-x-4 mb-4">
            <select 
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 focus:outline-none"
              required
            >
              <option value="">Ano</option>
              {generateYears().map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select 
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 focus:outline-none"
              required
            >
              <option value="">Mês</option>
              {generateMonths().map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
            <select 
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 focus:outline-none"
              required
            >
              <option value="">Dia</option>
              {generateDays().map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Faixa */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="belt" className="text-slate-200">Faixa</label>
          <select 
            id="belt"
            className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 mb-4 focus:outline-none"
            value={belt}
            onChange={(e) => setBelt(e.target.value)}
            required
          >
            <option value="">Selecione a Faixa</option>
            <option value="Faixa Branca">Faixa Branca</option>
            <option value="Faixa Cinza e Branca">Faixa Cinza e Branca</option>
            <option value="Faixa Azul">Faixa Azul</option>
            <option value="Faixa Roxa">Faixa Roxa</option>
            <option value="Faixa Marrom">Faixa Marrom</option>
            <option value="Faixa Preta">Faixa Preta</option>
          </select>
        </motion.div>

        {/* Email */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="email" className="text-slate-200">Email</label>
          <input 
            type="email"
            id="email"
            className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 mb-4 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        {/* Senha */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <label htmlFor="password" className="text-slate-200">Senha</label>
          <input 
            type="password"
            id="password"
            className="w-full p-3 bg-transparent border border-gray-700 text-slate-200 mb-4 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </motion.div>

        {/* Erro */}
        {error && (
          <motion.p className="text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {error}
          </motion.p>
        )}

        {/* Botão de Cadastro */}
        <motion.button 
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md mt-4 hover:bg-blue-600 transition duration-300"
          disabled={loading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </motion.button>
      </form>

      {/* Botão de Voltar */}
      <motion.button 
        onClick={handleBack} 
        className="w-full py-3 bg-gray-500 text-white rounded-md mt-4 hover:bg-gray-600 transition duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Voltar para Login
      </motion.button>
    </motion.div>
  );
};

export default Register;
