import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getCoordinates from '../components/getCoordinates';
import getNearbyCities from '../components/getNearbyCities';
import * as JWT from 'jwt-decode';
import '../styles/Dashboard.css';
import Modal from 'react-modal';
import RegisterMedicalRecord from '../components/RegisterMedicalRecord';
import { getStates, getCities } from '../components/getLocation';

Modal.setAppElement('#root'); 

const PatientDashboard = () => {
  const token = localStorage.getItem('token');
  const { user } = JWT.jwtDecode(token);
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [nursingHomes, setNursingHomes] = useState([]);
  const [loadingCaregivers, setLoadingCaregivers] = useState(true);
  const [loadingNursingHomes, setLoadingNursingHomes] = useState(true);
  const [registredMedicalRecord, setRegistredMedicalRecord] = useState(false)
  const [loading, setLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState({});
  const [profileData, setProfileData] = useState({
    name: user.name,
    cpf: user.cpf,
    email: user.email,
    state: user.state,
    city: user.city
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  useEffect(() => {
    const fetchStates = async () => {
      const statesData = await getStates();
      setStates(statesData);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if(user.state){
        const citiesData = await getCities(user.state);
        setCities(citiesData);
      }
    };

    fetchCities();
  }, [user.state]);


  useEffect(() => {
    const checkMedicalRecord = () => {
      axios.get(`/api/userData/medicalRecords/${user._id}`)
      .then(response => {
        const medicalRecord = response.data.medicalRecord;
        if(medicalRecord){
          setRegistredMedicalRecord(true);
          setProfileData(prevState => ({
            ...prevState,
            ...medicalRecord
          }));
        }
      })
      .catch(error => console.error('Error fetching medical record:', error))
      .finally(() => setLoading(false));
    };
    checkMedicalRecord();
  }, [user._id]);

  useEffect(() => {
    const fetchCaregiversAndNursingHomes = async () => {
      const city = user.city;
      const coords = await getCoordinates(city);
        if(coords){
          try{
            const cities = await getNearbyCities(coords.lat, coords.lon);
            const caregiversData = [];
            const nursingHomesData = [];
            setLoadingCaregivers(true);
            setLoadingNursingHomes(true);

            for(const city of cities){
              try{
                const caregiversResponse = await axios.get(`/api/searchByCity/city/${encodeURIComponent(city)}/caregiver`);
                caregiversData.push(...(caregiversResponse.data || []));
              }catch(error){
                console.error('Error fetching caregivers:', error);
              }

              try{
                const nursingHomesResponse = await axios.get(`/api/searchByCity/city/${encodeURIComponent(city)}/nursingHome`);
                nursingHomesData.push(...(nursingHomesResponse.data || []));
              }catch(error){
                console.error('Error fetching nursing homes:', error);
              }
            }

            setCaregivers(caregiversData);
            setNursingHomes(nursingHomesData);
          }catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoadingCaregivers(false);
            setLoadingNursingHomes(false);
          }
        } 
    };
    fetchCaregiversAndNursingHomes();
  }, [user.city]);


  const handleProfileInfo = () => {
    if(registredMedicalRecord) openModal("profile");
    else alert("Cadastre o prontuário do paciente!");
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
      const { name, cpf, state, city, email, patientName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact } = profileData;
      const userData = {
        name: name,
        cpf: cpf,
        email: email,
        state: state,
        city: city,
        password: user.password,
        role: user.role
      };
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
      await axios.put(`/api/userData/${user._id}`, userData);
      await axios.put(`/api/medicalRecords/${user._id}`, medicalRecordData);
      alert('Perfil atualizado com sucesso!');
      closeModal(); // Close modal after saving
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil.');
    }
  };

  const handleCommentChange = (e, id) => {
    setComments({ ...comments, [id]: e.target.value });
  };

  const handleSaveComment = async (id, type) => {
    try {
      await axios.post(`/api/${type}/comment`, { id, comment: comments[id] });
      alert('Comentário salvo com sucesso!');
      closeModal(); // Close modal after saving
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Erro ao salvar comentário.');
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
        registredMedicalRecord ?
        (<div className="dashboard">
          <h1>Olá {user.name}, seja bem vindo!</h1>
          <section>
            <h2>Cuidadores na região de {user.city}:</h2>
              <ul>
                {
                  loadingCaregivers ? (
                  <li>
                    <h3>Procurando cuidadores na sua região...</h3>
                  </li>
                  ) :
                  caregivers.length > 0 ? (
                    caregivers.filter(caregiver => caregiver.specialization !== null).length > 0 ? (
                      caregivers.filter(caregiver => caregiver.specialization !== null).map(caregiver => (
                        <li key={caregiver._id} onClick={() => openModal("caregiver", caregiver)}>
                          <h3>{caregiver.name} - {caregiver.city}</h3>
                        </li>
                      ))
                    ) : (
                      <li>
                        <h3>Não foi encontrado nenhum cuidador com especialização na sua região.</h3>
                      </li>
                    )
                  ) : (
                    <li>
                      <h3>Não foi encontrado nenhum cuidador cadastrado na sua região.</h3>
                    </li>
                  )
                }
              </ul>
          </section>
          <section>
            <h2>Casas de Repouso na região de {user.city}:</h2>
            <ul>
              {
                loadingNursingHomes ? (
                <li>
                  <h3>Procurando casas de repouso na sua região...</h3>
                </li>
                ) :
                nursingHomes.length > 0 ? (
                  nursingHomes.filter(nursingHome => nursingHome.locationDetails !== null).length > 0 ? (
                    nursingHomes.filter(nursingHome => nursingHome.locationDetails !== null).map(nursingHome => (
                      <li key={nursingHome._id} onClick={() => openModal("nursingHome", nursingHome)}>
                        <h3>{nursingHome.name} - {nursingHome.city}</h3>
                      </li>
                    ))
                  ) : (
                    <li>
                      <h3>Não foi encontrado nenhuma casa de repouso com detalhes de localização na sua região.</h3>
                    </li>
                  )
                ) : (
                  <li>
                    <h3>Não foi encontrado nenhuma casa de repouso cadastrada na sua região.</h3>
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
                          <input type="text" name="cpf" value={profileData.cpf} onChange={handleProfileChange}/>
                          <label>Endereço de Email:</label>
                          <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} />
                          <label>Estado:</label>
                          <select type="text" name="state" value={profileData.state} onChange={handleProfileChange} required>
                            <option value="">Selecione um estado</option>
                            {states.map(state => <option value={state.sigla} key={state.id}>{state.nome}</option>)}
                          </select>
                          <label>Cidade:</label>
                          <select type="text" name="city" value={profileData.city} onChange={handleProfileChange} required>
                            <option value="">Selecione uma cidade</option>
                            {cities.map(city => <option value={city.nome} key={city.id}>{city.nome}</option>)}
                          </select>
                        </div>
                        <div>
                          <h2>Prontuário do Paciente:</h2>
                          <label>Nome Completo:</label> 
                          <input type="text" name="patientName" value={profileData.patientName} onChange={handleProfileChange}/>
                          <label>Data de Nascimento:</label> 
                          <input type="text" name="birthDate" value={profileData.birthDate} onChange={handleProfileChange}/>
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
                          <label>Contato de Emergência:</label> 
                          <input type="text" name="emergencyContact" value={profileData.emergencyContact} onChange={handleProfileChange}/>
                          <label>Histórico Médico:</label> 
                          <textarea name="medicalHistory" value={profileData.medicalHistory} onChange={handleProfileChange}/>
                          <label>Alergias:</label> 
                          <textarea name="allergies" value={profileData.allergies} onChange={handleProfileChange}/>
                          <label>Medicações:</label> 
                          <textarea name="medications" value={profileData.medications} onChange={handleProfileChange}/>
                        </div>
                        <button onClick={handleSaveProfile}>Salvar Alterações</button>
                      </div>
                      : selectedInfo.info === "caregiver" && selectedInfo.data ?
                      <div>
                        <div>
                          <h2>Informações de Usuário do Cuidador:</h2>
                          <label>Nome de Usuário:</label> 
                          <p>{selectedInfo.data.name}</p>
                          <label>Cadastro de Pessoa Física (CPF):</label> 
                          <p>{selectedInfo.data.cpf}</p>
                          <label>Endereço de Email:</label> 
                          <p>{selectedInfo.data.email}</p>
                          <label>Estado:</label> 
                          <p>{selectedInfo.data.state}</p>
                          <label>Cidade:</label> 
                          <p>{selectedInfo.data.city}</p>
                        </div>
                        <div>
                          <h2>Especialização do Cuidador:</h2>
                          <label>Nome Completo:</label> 
                          <p>{selectedInfo.data.specialization.caregiverName}</p>
                          <label>Data de Nascimento:</label> 
                          <p>{selectedInfo.data.specialization.birthDate}</p>
                          <label>Gênero:</label> 
                          <p>{selectedInfo.data.specialization.gender}</p>
                          <label>Endereço:</label> 
                          <p>{selectedInfo.data.specialization.address}</p>
                          <label>Informações de Contato:</label> 
                          <p>{selectedInfo.data.specialization.contactInfo}</p>
                          <label>Área de Especialização:</label> 
                          <p>{selectedInfo.data.specialization.specializationArea}</p>
                          <label>Anos de Experiência:</label> 
                          <p>{selectedInfo.data.specialization.yearsOfExperience}</p>
                          <label>Qualificações:</label> 
                          <p>{selectedInfo.data.specialization.qualifications}</p>
                          <label>Certificados:</label> 
                          <p>{selectedInfo.data.specialization.certificates}</p>
                        </div>
                        <div>
                          <h2>Adicionar Comentário:</h2>
                          <textarea value={comments[selectedInfo.data._id] || ''} onChange={(e) => handleCommentChange(e, selectedInfo.data._id)} />
                          <button onClick={() => handleSaveComment(selectedInfo.data._id, 'caregiver')}>Salvar Comentário</button>
                        </div>
                      </div>
                      : selectedInfo.info === "nursingHome" && selectedInfo.data ?
                      <div>
                        <div>
                          <h2>Informações de Usuário da Casa de Repouso:</h2>
                          <label>Nome de Usuário:</label> 
                          <p>{selectedInfo.data.name}</p>
                          <label>Cadastro de Pessoa Física (CPF):</label> 
                          <p>{selectedInfo.data.cpf}</p>
                          <label>Endereço de Email:</label> 
                          <p>{selectedInfo.data.email}</p>
                          <label>Estado:</label> 
                          <p>{selectedInfo.data.state}</p>
                          <label>Cidade:</label> 
                          <p>{selectedInfo.data.city}</p>
                        </div>
                        <div>
                          <h2>Detalhes de Localização da Casa de Repouso:</h2>
                          <label>Nome Completo:</label> 
                          <p>{selectedInfo.data.locationDetails.nursingHomeName}</p>
                          <label>Endereço:</label> 
                          <p>{selectedInfo.data.locationDetails.address}</p>
                          <label>Bairro:</label> 
                          <p>{selectedInfo.data.locationDetails.neighborhood}</p>
                          <label>Código de Endereçamento Postal (CEP)::</label> 
                          <p>{selectedInfo.data.locationDetails.cep}</p>
                          <label>Informações de Contato:</label> 
                          <p>{selectedInfo.data.locationDetails.contactInfo}</p>
                        </div>
                        <div>
                          <h2>Adicionar Comentário:</h2>
                          <textarea value={comments[selectedInfo.data._id] || ''} onChange={(e) => handleCommentChange(e, selectedInfo.data._id)} />
                          <button onClick={() => handleSaveComment(selectedInfo.data._id, 'nursing-home')}>Salvar Comentário</button>
                        </div>
                      </div>
                      : null
                    }
                  </div>
              </Modal>
            )
          }
        </div>) : 
        (<RegisterMedicalRecord onRegistredMedicalRecord={medicalRecord => {
          setRegistredMedicalRecord(true);
          setProfileData(prevState => ({
            ...prevState,
            ...medicalRecord
          }));}
        }/>)
      }
    </div>
  );
};

export default PatientDashboard;