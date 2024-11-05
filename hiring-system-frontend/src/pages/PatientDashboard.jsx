import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getCoordinates from '../components/getCoordinates';
import getNearbyCities from '../components/getNearbyCities';
import * as JWT from 'jwt-decode';
import '../styles/Dashboard.css';
import Modal from 'react-modal';
import ModalProfile from '../components/ModalProfile';
import ModalCaregiver from '../components/ModalCaregiver';
import ModalNursingHome from '../components/ModalNursingHome';
import RegisterMedicalRecord from '../components/RegisterMedicalRecord';

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
  const [profileData, setProfileData] = useState({
    _id: user._id,
    name: user.name,
    cpf: user.cpf,
    email: user.email,
    state: user.state,
    city: user.city,
    role: user.role
  });

  useEffect(() => {
    const fetchMedicalRecord = () => {
      axios.get(`/api/userData/medicalRecords/${profileData._id}`)
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
    fetchMedicalRecord();
  }, []);

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
                const nursingHomesResponse = await axios.get(`/api/searchByCity/city/${encodeURIComponent(city)}/nursing-home`);
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
  }, []);
  
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
          <h1>Olá {profileData.name}, seja bem vindo!</h1>
          <section>
            <h2>Cuidadores na região de {profileData.city}:</h2>
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
            <h2>Casas de Repouso na região de {profileData.city}:</h2>
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
                      <ModalProfile profileData={profileData} onSetProfileData={profileData => setProfileData(profileData)} closeModal={closeModal}/>
                      : selectedInfo.info === "caregiver" && selectedInfo.data ?
                      <ModalCaregiver data={{...selectedInfo.data}} userName={profileData.name}/>
                      : selectedInfo.info === "nursingHome" && selectedInfo.data ?
                      <ModalNursingHome data={{...selectedInfo.data}} userName={profileData.name}/>
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