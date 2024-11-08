import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from "../components/Login";
import Register from '../components/Register';
import '../styles/Home.css';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const ServiceCard = ({ title, description }) => {
    return (
      <div className="card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#DCE9E2" />
          <path d="M17.091 8.18182L10.091 15.1818L6.90918 12" stroke="#00856F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };

  const openModal = modalType => {
    if (modalType === "login") setIsLoginModalOpen(true);
    if (modalType === "register") setIsRegisterModalOpen(true);
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className='home-container'>
      <nav className="home-navigation">
        <a className="logo" href="#home">
          <img className="logo-img" src="images/logo1.png" alt="CuidaLar Logo" />
        </a>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="home-navigation-links">
          <a className='home-navigation-link' href="#home">Início</a>
          <a className='home-navigation-link' href="#services">Serviços</a>
          <a className='home-navigation-link' href="#about">Sobre</a>
          <a className='home-navigation-link' href="#contact">Suporte</a>
        </div>
        <div className={`home-navigation-links ${isMenuOpen ? 'open' : ''}`}>
          <a className="button" onClick={() => { 
            openModal("login");
            toggleMenu();
          }}>Entrar</a>
          <a className="button" onClick={() => {
            openModal("register");
            toggleMenu();
          }}>Cadastrar</a>
        </div>
      </nav>
      <main className='home-main'>
        <section id="home">
          <div className="wrapper">
            <div className="col-a">
              <div className='header'>
                <h4>BEM-VINDO AO CUIDALAR 👋</h4>
                <h1>O cuidado que seus entes precisam!</h1>
              </div>
              <div className="content">
                <p>
                  Cuide de quem já cuidou de você. Aqui você encontra cuidadores, enfermeiros e acompanhantes, tudo em um só lugar. Ou encontre alguém que precisa dos seus serviços.
                </p>
                <a className="button" href="#services">Mais Sobre</a>
              </div>
            </div>
            <div className="col-b">
              <img src="images/Senhora-Alegre.png" alt="Senhora alegre e sorrindo" />
            </div>
          </div>
        </section>
        <section id="services">
          <div className="wrapper">
            <div className='header'>
              <h4>Serviços</h4>
              <h2>Como podemos ajudá-lo a se sentir melhor?</h2>
            </div>
            <div className="content">
              <div className="cards">
                <ServiceCard title="Cuidados com idosos" description="Oferecemos uma abordagem dedicada aos cuidados com idosos, promovendo o bem-estar físico, emocional e social." />
                <ServiceCard title="Acompanhantes para idosos" description="Nossos acompanhantes proporcionam companhia constante e assistência prática, garantindo conforto e segurança para os idosos." />
                <ServiceCard title="Enfermeiros" description="Enfermeiros especializados oferecem cuidados de saúde personalizados, incluindo monitoramento contínuo de condições médicas." />
                <ServiceCard title="Nutricionistas" description="Nossos nutricionistas criam dietas personalizadas para promover a saúde e o bem-estar dos idosos." />
                <ServiceCard title="Psicólogos" description="Oferecemos suporte psicológico especializado para idosos, ajudando a lidar com desafios emocionais e promovendo o bem-estar mental." />
                <ServiceCard title="Consulta Médica" description="As consultas médicas são essenciais para diagnosticar, tratar e monitorar a saúde geral dos idosos." />
              </div>
            </div>
          </div>
        </section>
        <section id="about">
          <div className="wrapper">
            <div className="col-a">
              <div className='header'>
                <h4>Sobre Nós</h4>
                <h2>Entenda quem somos e por que existimos:</h2>
              </div>
              <div className="content">
                <p>
                  Somos o CuidaLar, uma plataforma dedicada a facilitar o acesso a serviços especializados para cuidados com idosos. Nosso objetivo é conectar pessoas que necessitam de assistência para idosos com profissionais qualificados em todo o Brasil.
                </p>
                <p>
                  Acreditamos na importância de cuidar dos nossos idosos com respeito, compaixão e expertise. Nossa plataforma proporciona uma conexão direta entre cuidadores, enfermeiros, nutricionistas, psicólogos e médicos com aqueles que precisam de seus serviços, garantindo um suporte abrangente e personalizado para cada necessidade específica.
                </p>
              </div>
            </div>
            <div className="col-b">
              <img src="images/imageinicial1.jpg" alt="Senhora" />
            </div>
          </div>
        </section>
        <section id="contact">
          <div className="wrapper">
            <div className='header'>
              <h2>Entre em contato conosco:</h2>
            </div>
            <div className="content">
              <a className='support-link' href="mailto:cuidalar.cuidado@gmail.com?subject=Suporte+Cuida+Lar&body=Ol%C3%A1,+gostaria+de+ajuda+para+utilizar+os+servi%C3%A7os+da+Cuida+Lar." target='_blank' rel="noreferrer">
                <img className="support-icon" src="images/email-icon.png" alt="email" />
                cuidalar.cuidado@gmail.com
              </a>
              <a className='support-link' href="https://wa.me/5516999927225" target='_blank' rel="noreferrer">
                <img className="support-icon" src="images/whatsapp-icon.png" alt="whatsapp" />
                +55 (16) 99992-7225
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className='home-footer'>
        <div className='home-footer-button'>
          <a className="logo" href="#home">
            <img className="logo-img" src="images/logo1.png" alt="CuidaLar Logo" />
          </a>
        </div>
        <div className='home-footer-text'>
          <p>©2024 CuidaLar.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </footer>
      <Modal isOpen={isLoginModalOpen} onRequestClose={closeModal} contentLabel="Login Modal" className="modal" overlayClassName="overlay">
        <button className='close-button' onClick={closeModal}>✖</button>
        <Login/>
      </Modal>
      <Modal isOpen={isRegisterModalOpen} onRequestClose={closeModal} contentLabel="Register Modal" className="modal" overlayClassName="overlay">
        <button className='close-button' onClick={closeModal}>✖</button>
        <Register/>
      </Modal>
    </div>
  );
};

export default Home;