import mongoose from 'mongoose';
import User from '../models/User';
import MedicalRecord from '../models/MedicalRecord';
import Specialization from '../models/Specialization';
import LocationDetails from '../models/LocationDetails';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash, compare } = bcrypt;

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// -------------- User Functions --------------
export async function register(req, res) {
  try {
    const { name, cpf, state, city, email, password, role } = req.body;
    await connectDb();

    let user = await User.findOne({ name });
    if (user) return res.status(400).json({ message: 'Este nome de usuário já está cadastrado!' });

    user = await User.findOne({ cpf });
    if (user) return res.status(400).json({ message: 'Este CPF já está cadastrado!' });

    user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Este email já está cadastrado!' });

    const hashedPassword = await hash(password, 10);
    user = new User({ name, cpf, state, city, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    await connectDb();

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Senha inválida!' });

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// -------------- MedicalRecords Functions --------------
export async function createMedicalRecord(req, res) {
  try {
    const { userId, patientName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact } = req.body;
    await connectDb();

    const medicalRecord = new MedicalRecord({ userId, patientName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact });
    await medicalRecord.save();
    res.status(201).json({ medicalRecord });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar prontuário!', error });
  }
}

export async function getMedicalRecord(req, res) {
  try {
    const { userId } = req.params;
    await connectDb();

    const medicalRecord = await MedicalRecord.findOne({ userId });
    if (medicalRecord) {
      res.status(200).json({ medicalRecord });
    } else {
      res.status(203).json({});
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar prontuário!', error });
  }
}

export async function updateMedicalRecord(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    await connectDb();

    const medicalRecord = await MedicalRecord.findOneAndUpdate({ userId }, updateData, { new: true });
    if (medicalRecord) {
      res.status(200).json({ medicalRecord });
    } else {
      res.status(404).json({ message: 'Prontuário não encontrado!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar prontuário!', error });
  }
}

// -------------- Specializations Functions --------------
export async function createSpecialization(req, res) {
  try {
    const { userId, caregiverName, birthDate, gender, address, contactInfo, specializationArea, yearsOfExperience, qualifications, certificates } = req.body;
    await connectDb();

    const specialization = new Specialization({ userId, caregiverName, birthDate, gender, address, contactInfo, specializationArea, yearsOfExperience, qualifications, certificates });
    await specialization.save();
    res.status(201).json({ specialization });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar especialização!', error });
  }
}

export async function getSpecialization(req, res) {
  try {
    const { userId } = req.params;
    await connectDb();

    const specialization = await Specialization.findOne({ userId });
    if (specialization) {
      res.status(200).json({ specialization });
    } else {
      res.status(203).json({});
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar especialização!', error });
  }
}

export async function updateSpecialization(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    await connectDb();

    const specialization = await Specialization.findOneAndUpdate({ userId }, updateData, { new: true });
    if (specialization) {
      res.status(200).json({ specialization });
    } else {
      res.status(404).json({ message: 'Especialização não encontrada!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar especialização!', error });
  }
}

// -------------- LocationDetails Functions --------------
export async function createLocationDetails(req, res) {
  try {
    const { userId, nursingHomeName, address, neighborhood, cep, contactInfo } = req.body;
    await connectDb();

    const locationDetails = new LocationDetails({ userId, nursingHomeName, address, neighborhood, cep, contactInfo });
    await locationDetails.save();
    res.status(201).json({ locationDetails });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar detalhes da localização!', error });
  }
}

export async function getLocationDetails(req, res) {
  try {
    const { userId } = req.params;
    await connectDb();

    const locationDetails = await LocationDetails.findOne({ userId });
    if (locationDetails) {
      res.status(200).json({ locationDetails });
    } else {
      res.status(203).json({});
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar detalhes da localização!', error });
  }
}

export async function updateLocationDetails(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    await connectDb();

    const locationDetails = await LocationDetails.findOneAndUpdate({ userId }, updateData, { new: true });
    if (locationDetails) {
      res.status(200).json({ locationDetails });
    } else {
      res.status(404).json({ message: 'Detalhes da localização não encontrados!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar detalhes da localização!', error });
  }
}

// -------------- Main Handler --------------
export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      if (req.url.includes('/register')) return await register(req, res);
      if (req.url.includes('/login')) return await login(req, res);
      if (req.url.includes('/medicalRecords')) return await createMedicalRecord(req, res);
      if (req.url.includes('/specializations')) return await createSpecialization(req, res);
      if (req.url.includes('/locationDetails')) return await createLocationDetails(req, res);
      break;

    case 'GET':
      if (req.url.includes('/medicalRecords')) return await getMedicalRecord(req, res);
      if (req.url.includes('/specializations')) return await getSpecialization(req, res);
      if (req.url.includes('/locationDetails')) return await getLocationDetails(req, res);
      break;

    case 'PUT':
      if (req.url.includes('/medicalRecords')) return await updateMedicalRecord(req, res);
      if (req.url.includes('/specializations')) return await updateSpecialization(req, res);
      if (req.url.includes('/locationDetails')) return await updateLocationDetails(req, res);
      break;

    default:
      res.status(405).json({ message: 'Método não permitido' });
  }
}
