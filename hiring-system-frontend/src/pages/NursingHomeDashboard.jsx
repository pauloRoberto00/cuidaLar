import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import getCoordinates from '../components/getCoordinates';
import getNearbyCities from '../components/getNearbyCities';
import * as JWT from 'jwt-decode';
import '../styles/Dashboard.css';
import Modal from 'react-modal';
import ModalProfile from '../components/ModalProfile';
import ModalPatient from '../components/ModalPatient';
import RegisterLocationDetails from '../components/RegisterLocationDetails';

Modal.setAppElement('#root'); 

const NursingHomeDashboard = () => {
  const token = localStorage.getItem('token');
  const { user } = JWT.jwtDecode(token);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [registredLocationDetails, setRegistredLocationDetails] = useState(false)
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
    const fetchLocationDetails = () => {
      axios.get(`${apiUrl}/userData/locationDetails/${profileData._id}`)
      .then(response => {
        const locationDetails = response.data.locationDetails;
        if(locationDetails){
          setRegistredLocationDetails(true);
          setProfileData(prevState => ({
            ...prevState,
            ...locationDetails
          }));
        }
      })
      .catch(error => console.error('Error fetching location details:', error))
      .finally(() => setLoading(false));
    };

    fetchLocationDetails();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      const city = profileData.city;
      const coords = await getCoordinates(city);
        if(coords){
          try{
            const cities = await getNearbyCities(coords.lat, coords.lon);
            const patientsData = [];
            setLoadingPatients(true);

            for(const city of cities){
              try{
                const patientsResponse = await axios.get(`${apiUrl}/searchByCity/city/${encodeURIComponent(city)}/patient`);
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
  }, []);

  const handleProfileInfo = () => {
    if(registredLocationDetails) openModal("profile");
    else alert("Cadastre os detalhes de localização da casa de repouso!");
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
            <img className="logo-img" src="images/logo1.png" alt="logo"/>
          </div>
        </div>
        <div className="nav-links">
            <button className="profile-info-button" onClick={handleProfileInfo}>Ver Perfil</button>
            <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </div>
      { 
        loading ? <div className="loading">Carregando...</div> : 
        registredLocationDetails ?
        (<div className="dashboard">
          <h1>Olá {profileData.name}, seja bem vindo!</h1>
          <section>
            <h2>Pacientes na região de {profileData.city}:</h2>
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
                        <ModalProfile profileData={profileData} onSetProfileData={profileData => setProfileData(profileData)} closeModal={closeModal}/>
                        : selectedInfo.info === "patient" && selectedInfo.data ?
                        <ModalPatient {...selectedInfo.data}/>
                        : null
                      }
                  </div>
              </Modal>
            )
          }
        </div>) : 
        (<RegisterLocationDetails onRegistredLocationDetails={locationDetails => {
          setRegistredLocationDetails(true);
          setProfileData(prevState => ({
            ...prevState,
            ...locationDetails
          }));}
        }/>)
      }
    </div>
  );
};

export default NursingHomeDashboard;