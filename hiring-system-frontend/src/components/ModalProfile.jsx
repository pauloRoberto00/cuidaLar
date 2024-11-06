import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { formatDate, isValidDate } from './dateHandler.jsx';
import { formatCEP, isValidCEP } from './cepHandler.jsx';
import '../styles/Modal.css';
import { getStates, getCities } from './getLocation.jsx';

const ModalProfile = ({profileData, onSetProfileData, closeModal}) => {
    const [profileNewData, setProfileNewData] = useState({});
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [comments, setComments] = useState([]);
    const errorRef = useRef(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setProfileNewData(profileData);
        const fetchStates = async () => {
            const statesData = await getStates();
            setStates(statesData);
        };
      
        const fetchCities = async () => {
            if(profileData.state){
                const citiesData = await getCities(profileData.state);
                setCities(citiesData);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${process.env.API_URL}/commentsData/comments/${profileData.userId}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Erro ao carregar os comentários:', error);
            }
        };
        
        fetchStates();
        fetchCities();
        fetchComments();
    }, [profileData.userId]);
    
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const formattedDate = formatDate(value);
        setProfileNewData({ ...profileNewData, [name]: formattedDate });
    };

    const handleCEPChange = (e) => {
        const { name, value } = e.target;
        const formattedCEP = formatCEP(value);
        setProfileNewData({ ...profileNewData, [name]: formattedCEP });
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileNewData({ ...profileNewData, [name]: value });
    };

    
    const handleSaveProfile = async () => {
        try {
            const { patientName, caregiverName, nursingHomeName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact, specializationArea, yearsOfExperience, qualifications, certificates, neighborhood, cep } = profileNewData;
            let isValid;
            switch(profileData.role){
                case "patient":
                    const medicalRecordData = {
                        patientName: patientName,
                        birthDate: birthDate,
                        gender: gender,
                        address: address,
                        contactInfo: contactInfo,
                        medicalHistory: medicalHistory,
                        allergies: allergies,
                        medications: medications,
                        emergencyContact: emergencyContact
                    };
                    isValid = isValidDate(birthDate);
                    if(isValid){ 
                        await axios.put(`${process.env.API_URL}/userData/medicalRecords/${profileNewData.userId}`, medicalRecordData);
                        alert('Perfil atualizado com sucesso!');
                        closeModal(); 
                    }else{ 
                        setError('Data de Nascimento Inválida!');
                        errorRef.current.style.display = "block";
                        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    break;
                case "caregiver":
                    const specializationData = {
                        caregiverName: caregiverName,
                        birthDate: birthDate,
                        gender: gender,
                        address: address,
                        contactInfo: contactInfo,
                        specializationArea: specializationArea,
                        yearsOfExperience: yearsOfExperience,
                        qualifications: qualifications,
                        certificates: certificates 
                    };
                    isValid = isValidDate(birthDate);
                    if(isValid){ 
                        await axios.put(`${process.env.API_URL}/userData/specializations/${profileNewData.userId}`, specializationData);
                        alert('Perfil atualizado com sucesso!');
                        closeModal(); // Close modal after saving
                    }else{ 
                        setError('Data de Nascimento Inválida!');
                        errorRef.current.style.display = "block";
                        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    break;
                case "nursing-home":
                    const locationDetailsData = {
                        nursingHomeName: nursingHomeName,
                        address: address,
                        neighborhood: neighborhood,
                        cep: cep,
                        contactInfo: contactInfo
                    };
                    isValid = isValidCEP(cep);
                    if(isValid){ 
                        await axios.put(`${process.env.API_URL}/userData/locationDetails/${profileNewData.userId}`, locationDetailsData);
                        alert('Perfil atualizado com sucesso!');
                        closeModal(); // Close modal after saving
                    }else{ 
                        setError('Código de Endereçamento Postal (CEP) Inválido!');
                        errorRef.current.style.display = "block";
                        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    break;
                default:
                    break;
            }
            onSetProfileData(profileNewData);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil.');
        }
    };
    return (
        <div>
            <div>
                <h2>Informações do Usuário:</h2>
                <label>Nome de Usuário:</label>
                <input type="text" name="name" value={profileData.name} readOnly/>
                <label>Cadastro de Pessoa Física (CPF):</label>
                <input type="text" name="cpf" value={profileData.cpf} readOnly/>
                <label>Endereço de Email:</label>
                <input type="email" name="email" value={profileData.email} readOnly/>
                <label>Estado:</label>
                <select type="text" name="state" value={profileData.state} readOnly>
                    <option value="">Selecione um estado</option>
                    {states.map(state => <option value={state.sigla} key={state.id}>{state.nome}</option>)}
                </select>
                <label>Cidade:</label>
                <select type="text" name="city" value={profileData.city} readOnly>
                    <option value="">Selecione uma cidade</option>
                    {cities.map(city => <option value={city.nome} key={city.id}>{city.nome}</option>)}
                </select>
            </div>
            {
                profileData.role === "patient" ?
                    <div>
                        <h2>Prontuário do Paciente:</h2>
                        <label>Nome Completo:</label>
                        <input type="text" name="patientName" value={profileNewData.patientName} onChange={handleProfileChange} />
                        <label>Data de Nascimento:</label>
                        <input type="text" name="birthDate" maxLength="10" value={profileNewData.birthDate} onChange={handleDateChange} />
                        <label>Gênero:</label>
                        <select name="gender" value={profileNewData.gender} onChange={handleProfileChange} required>
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <label>Endereço:</label>
                        <input type="text" name="address" value={profileNewData.address} onChange={handleProfileChange} />
                        <label>Informações de Contato:</label>
                        <textarea name="contactInfo" value={profileNewData.contactInfo} onChange={handleProfileChange} />
                        <label>Contato de Emergência:</label>
                        <input type="text" name="emergencyContact" value={profileNewData.emergencyContact} onChange={handleProfileChange} />
                        <label>Histórico Médico:</label>
                        <textarea name="medicalHistory" value={profileNewData.medicalHistory} onChange={handleProfileChange} />
                        <label>Alergias:</label>
                        <textarea name="allergies" value={profileNewData.allergies} onChange={handleProfileChange} />
                        <label>Medicações:</label>
                        <textarea name="medications" value={profileNewData.medications} onChange={handleProfileChange} />
                    </div>
                    : profileData.role === "caregiver" ?
                        <div>
                            <h2>Especialização do Cuidador:</h2>
                            <label>Nome Completo:</label>
                            <input type="text" name="caregiverName" value={profileNewData.caregiverName} onChange={handleProfileChange} />
                            <label>Data de Nascimento:</label>
                            <input type="text" name="birthDate" maxLength="10" value={profileNewData.birthDate} onChange={handleDateChange} />
                            <label>Gênero:</label>
                            <select name="gender" value={profileNewData.gender} onChange={handleProfileChange} required>
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                            <label>Endereço:</label>
                            <input type="text" name="address" value={profileNewData.address} onChange={handleProfileChange} />
                            <label>Informações de Contato:</label>
                            <textarea name="contactInfo" value={profileNewData.contactInfo} onChange={handleProfileChange} />
                            <label>Área de Especialização:</label>
                            <input type="text" name="specializationArea" value={profileNewData.specializationArea} onChange={handleProfileChange} />
                            <label>Anos de Experiência:</label>
                            <input type="number" name="yearsOfExperience" value={profileNewData.yearsOfExperience} onChange={handleProfileChange} />
                            <label>Qualificações:</label>
                            <textarea name="qualifications" value={profileNewData.qualifications} onChange={handleProfileChange} />
                            <label>Certificados:</label>
                            <textarea name="certificates" value={profileNewData.certificates} onChange={handleProfileChange} />
                            <h2>Comentários:</h2>
                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <p>Não há comentários ainda.</p>
                                ) : (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <p>"{comment.content}"</p>
                                            <p>
                                                <strong>{comment.userName} - {new Date(comment.date).toLocaleString()}</strong>
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        : profileData.role === "nursing-home" ?
                            <div>
                                <h2>Detalhes de Localização da Casa de Repouso:</h2>
                                <label>Nome da Casa de Repouso:</label>
                                <input type="text" name="nursingHomeName" value={profileNewData.nursingHomeName} onChange={handleProfileChange} />
                                <label>Endereço:</label>
                                <input type="text" name="address" value={profileNewData.address} onChange={handleProfileChange} />
                                <label>Bairro:</label>
                                <input type="text" name="neighborhood" value={profileNewData.neighborhood} onChange={handleProfileChange} />
                                <label>Código de Endereçamento Postal (CEP):</label>
                                <input type="text" name="cep" minLength="9" maxLength="9" value={profileNewData.cep} onChange={handleCEPChange} />
                                <label>Informações de Contato:</label>
                                <textarea name="contactInfo" value={profileNewData.contactInfo} onChange={handleProfileChange} />
                                <h2>Comentários:</h2>
                                <div className="comments-list">
                                    {comments.length === 0 ? (
                                        <p>Não há comentários ainda.</p>
                                    ) : (
                                        comments.map((comment, index) => (
                                            <div key={index} className="comment">
                                                <p>"{comment.content}"</p>
                                                <p>
                                                    <strong>{comment.userName} - {new Date(comment.date).toLocaleString()}</strong>
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            : null
            }
            <button onClick={handleSaveProfile}>Salvar Alterações</button>
            <div ref={errorRef} className='register-data-error-container'>{error}</div>
        </div>
    );
};

export default ModalProfile;