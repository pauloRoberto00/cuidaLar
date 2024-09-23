import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as JWT from 'jwt-decode';
import '../styles/RegisterData.css';
import { formatDate, isValidDate } from './dateHandler.jsx';

const RegisterSpecialization = ({ onRegistredSpecialization }) => {
    const token = localStorage.getItem('token');
    const { user } = JWT.jwtDecode(token);
    const [formData, setFormData] = useState({
        caregiverName: '',
        birthDate: '',
        gender: '',
        address: '',
        contactInfo: '',
        specializationArea: '',
        yearsOfExperience: '',
        qualifications: '',
        certificates: ''
    });
    const errorRef = useRef(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const formattedDate = formatDate(value);
        setFormData({ ...formData, [name]: formattedDate });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const birthDate = formData.birthDate;
        const isValid = isValidDate(birthDate);
        if(isValid){
            axios.post(`/api/userData/specializations/`, { ...formData, userId: user._id })
            .then(response => {
                onRegistredSpecialization(response.data.specialization);  
            }).catch(error => console.error('Error registering specialization::', error));
        }else{
            setError('Data de Nascimento Inválida!');
            errorRef.current.style.display = "block";
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="register-data-container">
            <h1>Cadastro de Especialização do Cuidador</h1>
            <form className="register-data-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="caregiverName" 
                    value={formData.caregiverName} 
                    onChange={handleChange} 
                    placeholder="Nome Completo do Cuidador" 
                    required 
                />
                <input 
                    type="text" 
                    maxLength="10" 
                    name="birthDate" 
                    value={formData.birthDate} 
                    onChange={handleDateChange} 
                    placeholder="Data de Nascimento (dd/mm/yyyy)" 
                    required 
                />
                <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    placeholder="Gênero"
                    required
                >
                    <option value="">Selecione um Gênero</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>
                <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Endereço"  
                    required 
                />
                <textarea 
                    name="contactInfo" 
                    value={formData.contactInfo} 
                    onChange={handleChange} 
                    placeholder="Informações de Contato" 
                    required
                ></textarea>
                <input 
                    type="text" 
                    name="specializationArea"
                    value={formData.specializationArea} 
                    onChange={handleChange} 
                    placeholder="Área de Especialização" 
                    required 
                />
                <input 
                    type="number" 
                    min="1"
                    max="100" 
                    name="yearsOfExperience" 
                    value={formData.yearsOfExperience} 
                    onChange={handleChange} 
                    placeholder="Anos de Experiência" 
                    required 
                />
                <textarea 
                    name="qualifications" 
                    value={formData.qualifications} 
                    onChange={handleChange} 
                    placeholder="Qualificações" 
                    required
                ></textarea>
                <textarea 
                    name="certificates" 
                    value={formData.certificates} 
                    onChange={handleChange} 
                    placeholder="Certificados" 
                    required
                ></textarea>
                <button type="submit">Cadastrar Especialização</button>
            </form>
            <div ref={errorRef} className='register-data-error-container'>{error}</div>
        </div>
    );
};

export default RegisterSpecialization;