// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Welcome from "./components/Welcome"; 
import PageAdmin from "./components/AdminPage";  // Importando a página de administração
import PrivateRoute from "./components/PrivateRoute"; 

const App = () => {
  return (
    <Router>
      <div className="bg-[#0E0F11]">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rota para o Dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><Welcome /></PrivateRoute>} />
          
          {/* Rota para a página de administração */}
          <Route path="/admin" element={<PageAdmin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
