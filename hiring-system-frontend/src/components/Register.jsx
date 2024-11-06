import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as JWT from 'jwt-decode';
import '../styles/RegisterData.css';
import { formatCPF, isValidCPF } from './cpfHandler';
import { getStates, getCities } from './getLocation';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    state: '',
    city: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const errorRef = useRef(null);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchStates = async () => {
      const statesData = await getStates();
      setStates(statesData);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if(formData.state){
        const citiesData = await getCities(formData.state);
        setCities(citiesData);
      }
    };

    fetchCities();
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCPFChange = (e) => {
    const { name, value } = e.target;
    const formattedCPF = formatCPF(value);
    setFormData({ ...formData, [name]: formattedCPF });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cpf = formData.cpf.replace(/\D/g, '');
    const isValid = isValidCPF(cpf);
    if(isValid){
      try {
        const response = await axios.post(`${apiUrl}/userData/register`, formData);
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
    }else{
      setError('Cadastro de Pessoa Física (CPF) Inválido!');
      errorRef.current.style.display = "block";
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='register-data-container'>
      <h1>Cadastrar Usuário</h1>
      <form className='register-data-form' onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          value={formData.name}
          onChange={handleChange} 
          placeholder="Nome de Usuário" 
          required
        />
        <input 
          type="text" 
          name="cpf" 
          maxLength="14" 
          value={formData.cpf}
          onChange={handleCPFChange} 
          placeholder="Cadastro de Pessoa Física (CPF)" 
          required
        />
        <select 
          name="state" 
          value={formData.state}
          onChange={handleChange} 
          required
        >
          <option value="">Selecione um estado</option>
          {states.map(state => <option value={state.sigla} key={state.id}>{state.nome}</option>)}
        </select>
        <select 
          name="city" 
          value={formData.city}
          onChange={handleChange} 
          required>
          <option value="">Selecione uma cidade</option>
          {cities.map(city => <option value={city.nome} key={city.id}>{city.nome}</option>)}
        </select>
        <input 
          type="email"
          name="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="Email" 
          required
        />
        <input 
          type="password"
          name="password" 
          value={formData.password}
          onChange={handleChange} 
          placeholder="Senha" 
          required
        />
        <select 
          name="role" 
          value={formData.role}
          onChange={handleChange}
        >
          <option value="patient">Paciente</option>
          <option value="caregiver">Cuidador</option>
          <option value="nursing-home">Casa de Repouso</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      <div ref={errorRef} className='register-data-error-container'>{error}</div>
    </div>
  );
};

export default Register;