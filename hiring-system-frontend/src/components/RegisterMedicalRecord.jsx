import React, { useState, useRef } from 'react';
import axios from 'axios';
import * as JWT from 'jwt-decode';
import '../styles/RegisterData.css';
import { formatDate, isValidDate } from './dateHandler.jsx';

const RegisterMedicalRecord = ({ onRegistredMedicalRecord }) => {
    const token = localStorage.getItem('token');
    const { user } = JWT.jwtDecode(token);
    const [formData, setFormData] = useState({
        patientName: '',
        birthDate: '',
        gender: '',
        address: '',
        contactInfo: '',
        medicalHistory: '',
        allergies: '',
        medications: '',
        emergencyContact: ''
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
            axios.post(`/api/userData/medicalRecords/`, { ...formData, userId: user._id })
            .then(response => {
                onRegistredMedicalRecord(response.data.medicalRecord);  
            }).catch(error => console.error('Error registering medical record:', error));
        }else{
            setError('Data de Nascimento Inválida!');
            errorRef.current.style.display = "block";
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="register-data-container" style={{marginTop: "100px"}}>
            <h1>Cadastro de Prontuário Médico do Paciente</h1>
            <form className="register-data-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="patientName" 
                    value={formData.patientName} 
                    onChange={handleChange} 
                    placeholder="Nome Completo do Paciente"
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
                <textarea 
                    name="medicalHistory" 
                    value={formData.medicalHistory} 
                    onChange={handleChange} 
                    placeholder="Histórico Médico"
                    required
                ></textarea>
                <textarea 
                    name="allergies" 
                    value={formData.allergies} 
                    onChange={handleChange} 
                    placeholder="Alergias"
                    required
                ></textarea>
                <textarea 
                    name="medications" 
                    value={formData.medications} 
                    onChange={handleChange} 
                    placeholder="Medicações"
                    required
                ></textarea>
                <input 
                    type="text" 
                    name="emergencyContact" 
                    value={formData.emergencyContact} 
                    onChange={handleChange} 
                    placeholder="Contato de Emergência"
                    required 
                />
                <button type="submit">Cadastrar Prontuário</button>
                <div ref={errorRef} className='register-data-error-container'>{error}</div>
            </form>
        </div>
    );
};

export default RegisterMedicalRecord;