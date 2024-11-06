import mongoose from 'mongoose';
import Comment from '../models/Comment';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function postComment(req, res) {
  try {
    const { userId, userName, type, content, date } = req.body;
    await connectDb();

    const comment = new Comment({ userId, userName, type, content, date });
    await comment.save();
    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar comentário!', error });
  }
}

export async function getComments(req, res) {
  try {
    const { userId } = req.params;
    await connectDb();

    const comments = await Comment.find({ userId }).sort({ date: -1 });
    res.status(200).json({ comments: comments.length > 0 ? comments : [] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar comentários!', error });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      await postComment(req, res);
      break;
    case 'GET':
      await getComments(req, res);
      break;
    default:
      res.status(405).json({ message: 'Método não permitido' });
  }
}