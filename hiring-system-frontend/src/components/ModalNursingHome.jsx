import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const ModalNursingHome = data => {
    const { _id, name, cpf, email, state, city, locationDetails } = data.data;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/commentsData/comments/${_id}`);
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
                type: 'nursing-home', 
                content: newComment,
                date: new Date()
            };
            await axios.post('/api/commentsData/comments/', comment);
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
                <h2>Informações de Usuário da Casa de Repouso:</h2>
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
                <h2>Detalhes de Localização da Casa de Repouso:</h2>
                <div className='data-content'>
                    <label>Nome Completo:</label>
                    <span>{locationDetails.nursingHomeName}</span>
                </div>
                <div className='data-content'>
                    <label>Endereço:</label>
                    <span>{locationDetails.address}</span>
                </div>
                <div className='data-content'>
                    <label>Bairro:</label>
                    <span>{locationDetails.neighborhood}</span>
                </div>
                <div className='data-content'>
                    <label>Código de Endereçamento Postal (CEP)::</label>
                    <span>{locationDetails.cep}</span>
                </div>
                <div className='data-content'>
                    <label>Informações de Contato:</label>
                    <span>{locationDetails.contactInfo}</span>
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

export default ModalNursingHome;