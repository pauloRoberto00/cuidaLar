import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const ModalCaregiver = data => {
    const { _id, name, cpf, email, state, city, specialization } = data.data;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/commentsData/comments/${_id}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Erro ao carregar os comentários:', error);
            }
        };
        
        fetchComments();
    }, [_id]);

    const handleCommentChange = (e) => setNewComment(e.target.value);

    const handleSaveComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = {
                userId: _id, 
                userName: data.userName,
                type: 'caregiver', 
                content: newComment,
                date: new Date()
            };
            await axios.post(`${apiUrl}/commentsData/comments/`, comment);
            setComments(prevComments => [...prevComments, comment]);
            setNewComment('');
            alert('Comentário salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar comentário:', error);
            alert('Erro ao salvar comentário.');
        }
    };

    return (
        <div>
            <div>
                <h2>Informações de Usuário do Cuidador:</h2>
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
                <h2>Especialização do Cuidador:</h2>
                <div className='data-content'>
                    <label>Nome Completo:</label>
                    <span>{specialization.caregiverName}</span>
                </div>
                <div className='data-content'>
                    <label>Data de Nascimento:</label>
                    <span>{specialization.birthDate}</span>
                </div>
                <div className='data-content'>
                    <label>Gênero:</label>
                    <span>{specialization.gender}</span>
                </div>
                <div className='data-content'>
                    <label>Endereço:</label>
                    <span>{specialization.address}</span>
                </div>
                <div className='data-content'>
                    <label>Informações de Contato:</label>
                    <span>{specialization.contactInfo}</span>
                </div>
                <div className='data-content'>
                    <label>Área de Especialização:</label>
                    <span>{specialization.specializationArea}</span>
                </div>
                <div className='data-content'>
                    <label>Anos de Experiência:</label>
                    <span>{specialization.yearsOfExperience}</span>
                </div>
                <div className='data-content'>
                    <label>Qualificações:</label>
                    <span>{specialization.qualifications}</span>
                </div>
                <div className='data-content'>
                    <label>Certificados:</label>
                    <span>{specialization.certificates}</span>
                </div>
            </div>
            <div>
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
            <div>
                <h2>Adicionar Comentário:</h2>
                <textarea 
                    placeholder="Adicione um comentário..." 
                    value={newComment} 
                    onChange={handleCommentChange} 
                />
                <button onClick={handleSaveComment}>Salvar Comentário</button>
            </div>
        </div>
    );
};

export default ModalCaregiver;