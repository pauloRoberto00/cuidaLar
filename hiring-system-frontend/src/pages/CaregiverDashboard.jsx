import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import getCoordinates from '../components/getCoordinates';
import getNearbyCities from '../components/getNearbyCities';
import * as JWT from 'jwt-decode';
import '../styles/Dashboard.css';
import Modal from 'react-modal';
import RegisterSpecialization from '../components/RegisterSpecialization';

Modal.setAppElement('#root'); 

const CaregiverDashboard = () => {
  const token = localStorage.getItem('token');
  const { user } = JWT.jwtDecode(token);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [registredSpecialization, setRegistredSpecialization] = useState(false)
  const [loading, setLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    cpf: user.cpf,
    email: user.email,
    state: user.state,
    city: user.city
  });

  useEffect(() => {
    const checkSpecialization = () => {
      axios.get(`/api/userData/specializations/${user._id}`)
      .then(response => {
        const specialization = response.data.specialization;
        if(specialization.lenght){
          setRegistredSpecialization(true);
          setProfileData(prevState => ({
            ...prevState,
            ...specialization
          }));
        }
      })
      .catch(error => {})
      .finally(() => setLoading(false));
    };

    checkSpecialization();
  }, [user._id]);

  useEffect(() => {
    const fetchPatients = async () => {
      const city = user.city;
      const coords = await getCoordinates(city);
        if(coords){
          try{
            const cities = await getNearbyCities(coords.lat, coords.lon);
            const patientsData = [];
            setLoadingPatients(true);

            for(const city of cities){
              try{
                const patientsResponse = await axios.get(`/api/searchByCity/city/${encodeURIComponent(city)}/patient`);
                patientsData.push(...(patientsResponse.data || []));
              }catch(error){
                console.error('Error fetching patients:', error);
              }
            }

            setPatients(patientsData);
          }catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoadingPatients(false);
          }
        } 
    };
    fetchPatients();
  }, [user.city]);

  const handleProfileInfo = () => {
    if(registredSpecialization) openModal("profile");
    else alert("Cadastre a especialização do cuidador!");
  };
  const handleLogout = () => {
    if(window.confirm("Tem certeza que deseja sair?")){
      localStorage.removeItem('token');
      navigate("/");
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`/api/userData/${user._id}`, profileData);
      alert('Perfil atualizado com sucesso!');
      closeModal(); // Close modal after saving
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  const openModal = (info, data = null) => {
    if(!isModalOpen){
      setSelectedInfo({info, data});
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setSelectedInfo(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav-links">
          <div className="nav-link">
            <img className="logo-img" src="../assets/logo1.png" alt="logo"/>
          </div>
        </div>
        <div className="nav-links">
            <button className="profile-info-button" onClick={handleProfileInfo}>Ver Perfil</button>
            <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </div>
      { 
        loading ? 
        <div className="loading">Carregando...</div> : 
        (<div className="dashboard">
          {
            registredSpecialization ?
            (<div className="dashboard-content">
              <h1>Olá {user.name}, seja bem vindo!</h1>
              <section>
                <h2>Pacientes na região de {user.city}:</h2>
                  <ul>
                    {
                      loadingPatients ? (
                      <li>
                        <h3>Procurando pacientes na sua região...</h3>
                      </li>
                      ) :
                      patients.length > 0 ? (
                        patients.filter(patient => patient.medicalRecord !== null).length > 0 ? (
                          patients.filter(patient => patient.medicalRecord !== null).map(patient => (
                            <li key={patient._id} onClick={() => openModal("patient", patient)}>
                              <h3>{patient.name} - {patient.city}</h3>
                            </li>
                          ))
                        ) : (
                          <li>
                            <h3>Não foi encontrado nenhum paciente com prontuário na sua região.</h3>
                          </li>
                        )
                      ) : (
                        <li>
                          <h3>Não foi encontrado nenhum paciente cadastrado na sua região.</h3>
                        </li>
                      )
                    }
                  </ul>
              </section>
              {
                isModalOpen && selectedInfo && (
                  <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Information Modal" className="modal" overlayClassName="overlay">
                      <button className='close-modal' onClick={closeModal}>✖</button>
                      <div className='modal-content'>
                        {
                          selectedInfo.info === "profile" ?
                          <div>
                            <div>
                              <h2>Informações do Usuário:</h2>
                              <label>Nome de Usuário:</label>
                              <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} />
                              <label>Cadastro de Pessoa Física (CPF):</label>
                              <input type="text" name="cpf" value={profileData.cpf} readOnly/>
                              <label>Endereço de Email:</label>
                              <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                              <label>Estado:</label>
                              <input type="text" name="state" value={profileData.state} readOnly/>
                              <label>Cidade:</label>
                              <input type="text" name="city" value={profileData.city} readOnly/>
                            </div>
                            <div>
                              <h2>Especialização do Cuidador:</h2>
                              <label>Nome Completo:</label> 
                              <input type="text" name="caregiverName" value={profileData.caregiverName} onChange={handleProfileChange}/>
                              <label>Data de Nascimento:</label> 
                              <input type="date" name="birthDate" value={profileData.birthDate} onChange={handleProfileChange}/>
                              <label>Gênero:</label> 
                              <select name="gender" value={profileData.gender} onChange={handleProfileChange} required>
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                              </select>
                              <label>Endereço:</label> 
                              <input type="text" name="address" value={profileData.address} onChange={handleProfileChange}/>
                              <label>Informações de Contato:</label> 
                              <textarea name="contactInfo" value={profileData.contactInfo} onChange={handleProfileChange}/>
                              <label>Área de Especialização:</label> 
                              <input type="text" name="specializationArea" value={profileData.specializationArea} onChange={handleProfileChange}/>
                              <label>Anos de Experiência:</label> 
                              <input type="number" name="yearsOfExperience" value={profileData.yearsOfExperience} onChange={handleProfileChange}/>
                              <label>Qualificações:</label> 
                              <textarea name="qualifications" value={profileData.qualifications} onChange={handleProfileChange}/>
                              <label>Certificados:</label> 
                              <textarea name="certificates" value={profileData.certificates} onChange={handleProfileChange}/>
                            </div>
                            <button onClick={handleSaveProfile}>Salvar Alterações</button>
                          </div>
                          : selectedInfo.info === "patient" && selectedInfo.data ?
                          <div>
                            <div>
                              <h2>Informações de Usuário do Paciente:</h2>
                              <p>Nome de Usuário: {selectedInfo.data.name}</p>
                              <p>Cadastro de Pessoa Física (CPF): {selectedInfo.data.cpf}</p>
                              <p>Endereço de Email: {selectedInfo.data.email}</p>
                              <p>Estado: {selectedInfo.data.state}</p>
                              <p>Cidade: {selectedInfo.data.city}</p>
                            </div>
                            <div>
                              <h2>Prontuário do Paciente:</h2>
                              <p>Nome Completo: {selectedInfo.data.medicalRecord.patientName}</p>
                              <p>Data de Nascimento: {selectedInfo.data.medicalRecord.birthDate}</p>
                              <p>Gênero: {selectedInfo.data.medicalRecord.gender}</p>
                              <p>Endereço: {selectedInfo.data.medicalRecord.address}</p>
                              <p>Informações de Contato: {selectedInfo.data.medicalRecord.contactInfo}</p>
                              <p>Contado de Emergência: {selectedInfo.data.medicalRecord.emergencyContact}</p>
                              <p>Histórico Médico: {selectedInfo.data.medicalRecord.medicalHistory}</p>
                              <p>Alergias: {selectedInfo.data.medicalRecord.allergies}</p>
                              <p>Medicações: {selectedInfo.data.medicalRecord.medications}</p>
                            </div>
                          </div>
                          : null
                        }
                      </div>
                  </Modal>
                )
              }
            </div>) :
            (<RegisterSpecialization onRegistredSpecialization={specialization => {
              setRegistredSpecialization(true);
              setProfileData(prevState => ({
                ...prevState,
                ...specialization
              }));
            }}/>)
          }
        </div>)
      }
    </div>
  );
};

export default CaregiverDashboard;