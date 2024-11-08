import { Router } from 'express';
import Comment from '../models/Comment.js';
const router = Router();

router.post('/comments', async (req, res) => {
    try {
        const { userId, userName, type, content, date } = req.body;
        const comment = new Comment({ userId, userName, type, content, date });
        await comment.save();
        res.status(201).json({ comment });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar comentário!', error });
    }
});

router.get('/comments/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await Comment.find({ userId }).sort({ date: -1 });
        if(comments.length > 0) res.status(200).json({ comments });
         else res.status(200).json({ comments: [] });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar comentário!', error });
    }
});

router.delete('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        res.status(200).json({ comment: comment });
        // if(comment){
        //     await comment.remove();
        //     res.status(200).json({ message: 'Comentário deletado com sucesso!' });
        // } else{
        //     res.status(404).json({ message: 'Comentário não encontrado!' });
        // }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar comentário!', error });
    }
});

export default router;