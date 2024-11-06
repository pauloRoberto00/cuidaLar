import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as JWT from 'jwt-decode';
import '../styles/RegisterData.css';
import { formatCEP, isValidCEP } from './cepHandler.jsx';

const RegisterLocationDetails = ({ onRegistredLocationDetails }) => {
    const token = localStorage.getItem('token');
    const { user } = JWT.jwtDecode(token);
    const [formData, setFormData] = useState({
        nursingHomeName: '',
        address: '',
        neighborhood: '',
        cep: '',
        contactInfo: '',
    });
    const errorRef = useRef(null);
    const [error, setError] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCEPChange = (e) => {
        const { name, value } = e.target;
        const formattedCEP = formatCEP(value);
        setFormData({ ...formData, [name]: formattedCEP });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cep = formData.cep;
        const isValid = await isValidCEP(cep);
        if(isValid){
            axios.post(`${apiUrl}/userData/locationDetails/`, { ...formData, userId: user._id })
            .then(response => {
                onRegistredLocationDetails(response.data.locationDetails);  
            }).catch(error => console.error('Error registering location details:', error));
        }else{
            setError('Código de Endereçamento Postal (CEP) Inválido!');
            errorRef.current.style.display = "block";
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="register-data-container" style={{marginTop: "100px"}}>
            <h1>Cadastro de Detalhes de Localização da Casa de Repouso</h1>
            <form className="register-data-form" onSubmit={handleSubmit}>
                <input  
                    type="text" 
                    name="nursingHomeName" 
                    value={formData.nursingHomeName} 
                    onChange={handleChange} 
                    placeholder="Nome da Casa de Repouso"
                    required 
                />
                <input  
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Endereço"
                    required 
                />
                <input  
                    type="text" 
                    name="neighborhood" 
                    value={formData.neighborhood} 
                    onChange={handleChange} 
                    placeholder="Bairro"
                    required 
                />
                <input  
                    type="text" 
                    name="cep" 
                    minLength="9"
                    maxLength="9"
                    value={formData.cep} 
                    onChange={handleCEPChange} 
                    placeholder="Código de Endereçamento Postal (CEP)"
                    required 
                />
                <textarea 
                    name="contactInfo" 
                    value={formData.contactInfo} 
                    onChange={handleChange} 
                    placeholder="Informações de Contato" 
                    required
                ></textarea>
                <button type="submit">Cadastrar Detalhes de Localização</button>
            </form>
            <div ref={errorRef} className='register-data-error-container'>{error}</div>
        </div>
    );
};

export default RegisterLocationDetails;