import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const ModalNursingHome = data => {
    const { _id, name, cpf, email, state, city, locationDetails } = data.selectedData;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${apiUrl}/commentsData/comments/${_id}`);
            setComments(response.data.comments);
        } catch (error) {
            console.error('Erro ao carregar os comentários:', error);
        }
    };
    useEffect(() => fetchComments(), [_id]);

    const handleCommentChange = (e) => setNewComment(e.target.value);

    const handleSaveComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = {
                userId: _id, 
                content: newComment,
                authorUserId: data.profileData._id,
                authorUserName: data.profileData.name,
                date: new Date()
            };
            await axios.post(`${apiUrl}/commentsData/comments/`, comment);
            await fetchComments();
            setNewComment('');
            alert('Comentário salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar comentário:', error);
            alert('Erro ao salvar comentário.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if(window.confirm("Tem certeza que deseja deletar o comentário?")){
            try {
                await axios.delete(`${apiUrl}/commentsData/comments/${commentId}`);
                setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            } catch (error) {
                console.error('Erro ao deletar comentário:', error);
                alert('Erro ao deletar comentário.');
            }
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
                                {comment.authorUserId === data.profileData._id && (
                                    <button className='close-button' onClick={() => handleDeleteComment(comment._id)}>✖</button>
                                )}
                                <p>"{comment.content}"</p>
                                <p>
                                    <strong>{comment.authorUserName} - {new Date(comment.date).toLocaleString()}</strong>
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
                <button className="save-button" onClick={handleSaveComment}>Salvar Comentário</button>
            </div>
        </div>
    );
};

export default ModalNursingHome;