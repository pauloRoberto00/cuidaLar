import mongoose from 'mongoose';
import Comment from '../../models/Comment';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async function handler(req, res) {
  await connectDb();
  
  if (req.method === 'POST') {
    try {
      const { userId, userName, type, content, date } = req.body;
      const comment = new Comment({ userId, userName, type, content, date });
      await comment.save();
      res.status(201).json({ comment });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar comentário!', error });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      const comments = await Comment.find({ userId }).sort({ date: -1 });
      res.status(200).json({ comments: comments.length > 0 ? comments : [] });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao verificar comentários!', error });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}