import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as JWT from 'jwt-decode';
import '../styles/RegisterData.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [ name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/userData/login', formData);
      const token = response.data;
      localStorage.setItem('token', token);
      const { user } = JWT.jwtDecode(token);
      const role = user.role;
      switch(role){
        case "patient":
          navigate('../patient');
          break;
        case "caregiver":
          navigate('../caregiver');
          break;
        case "nursing-home":
          navigate('../nursing-home');
          break;
        default:
          break;
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Erro desconhecido');
      errorRef.current.style.display = "block";
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='register-data-container'>
      <h1>Entrar</h1>
      <form className='register-data-form' onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <div ref={errorRef} className="register-data-error-container">{error}</div>
    </div>
  );
};

export default Login;