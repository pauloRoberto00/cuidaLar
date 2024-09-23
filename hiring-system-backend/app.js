import dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import userDataRoutes from './routes/userData.js';
import searchByCityRoute from './routes/searchByCity.js';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(json());

connect(MONGO_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch(error => console.log(error));

app.use('/api/userData', userDataRoutes);
app.use('/api/searchByCity', searchByCityRoute);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));