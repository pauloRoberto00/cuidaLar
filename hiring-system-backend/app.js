import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import userDataRoutes from './routes/userData.js';
import searchByCityRoute from './routes/searchByCity.js';
import searchNearbyCitiesRoute from './routes/searchNearbyCities.js';
import commentsDataRoutes from './routes/commentsData.js';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(cors({
    origin: 'https://cuida-lar.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true, 
}));  
app.use(json());

connect(MONGO_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch(error => console.log(error));

app.use('/userData', userDataRoutes);
app.use('/searchByCity', searchByCityRoute);
app.use('/searchNearbyCities', searchNearbyCitiesRoute);
app.use('/commentsData', commentsDataRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));