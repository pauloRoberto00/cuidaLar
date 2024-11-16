import axios from 'axios';

const getComments = async (_id) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${apiUrl}/commentsData/comments/${_id}`);
        return response.data.comments;
    } catch (error) {
        console.error('Erro ao carregar os comentários:', error);
        return [];
    }
};

export default getComments;