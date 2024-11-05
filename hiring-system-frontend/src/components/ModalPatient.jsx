import '../styles/Modal.css';

const ModalPatient = data => {
    const { name, cpf, email, state, city, medicalRecord } = data;
    return(
        <div>
            <div>
                <h2>Informações de Usuário do Paciente:</h2>
                <div className='data-content'>
                    <label>Nome de Usuário:</label>
                    <span>{name}</span>
                </div>
                <div className='data-content'>
                    <label>Cadastro de Pessoa Física (CPF):</label>
                    <span>{cpf}</span>
                </div>
                <div className='data-content'>
                    <label>Endereço de Email:</label>
                    <span>{email}</span>
                </div>
                <div className='data-content'>
                    <label>Estado:</label>
                    <span>{state}</span>
                </div>
                <div className='data-content'>
                    <label>Cidade:</label>
                    <span>{city}</span>
                </div>
            </div>
            <div>
                <h2>Prontuário do Paciente:</h2>
                <div className='data-content'>
                    <label>Nome Completo:</label>
                    <span>{medicalRecord.patientName}</span>
                </div>
                <div className='data-content'>
                    <label>Data de Nascimento:</label>
                    <span>{medicalRecord.birthDate}</span>
                </div>
                <div className='data-content'>
                    <label>Gênero:</label>
                    <span>{medicalRecord.gender}</span>
                </div>
                <div className='data-content'>
                    <label>Endereço:</label>
                    <span>{medicalRecord.address}</span>
                </div>
                <div className='data-content'>
                    <label>Informações de Contato:</label>
                    <span>{medicalRecord.contactInfo}</span>
                </div>
                <div className='data-content'>
                    <label>Contado de Emergência:</label>
                    <span>{medicalRecord.emergencyContact}</span>
                </div>
                <div className='data-content'>
                    <label>Histórico Médico:</label>
                    <span>{medicalRecord.medicalHistory}</span>
                </div>
                <div className='data-content'>
                    <label>Alergias:</label>
                    <span>{medicalRecord.allergies}</span>
                </div>
                <div className='data-content'>
                    <label>Medicações:</label>
                    <span>{medicalRecord.medications}</span>
                </div>
            </div>
        </div>
    );
};

export default ModalPatient;