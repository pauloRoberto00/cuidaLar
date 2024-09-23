import { Router } from "express";
const router = Router();
import User from '../models/User.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Specialization from '../models/Specialization.js';
import LocationDetails from '../models/LocationDetails.js'
import pkg from 'bcryptjs';
const { hash, compare } = pkg;
import jwt from 'jsonwebtoken';

// Registro de Usuário
router.post('/register', async (req, res) => {
  try {
    const { name, cpf, state, city, email, password, role } = req.body;
    let user = await User.findOne({ name });
    if(user) return res.status(400).json({ message: 'Este nome de usuário já está cadastrado!' });
    user = await User.findOne({ cpf });
    if(user) return res.status(400).json({ message: 'Este CPF já está cadastrado!' });
    user = await User.findOne({ email });
    if(user) return res.status(400).json({ message: 'Este email já está cadastrado!' });
    const hashedPassword = await hash(password, 10);
    user = new User({ name, cpf, state, city, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login de Usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if(!user) return res.status(404).json({ message: 'Usuário não encontrado!' });
    const isMatch = await compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: 'Senha inválida!' });
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar Usuário
router.put('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const user = await User.findOneAndUpdate({ _id: userId }, updateData, { new: true });
      if(user) res.status(200).json({ message: 'Usuário atualizado!' });
      else res.status(404).json({ message: 'Usuário não encontrado!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar usuário!', error });
    }
});

// Cadastrar prontuário
router.post('/medicalRecords', async (req, res) => {
    try {
        const { userId, patientName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact } = req.body;
        const medicalRecord = new MedicalRecord({ userId, patientName, birthDate, gender, address, contactInfo, medicalHistory, allergies, medications, emergencyContact });
        await medicalRecord.save();
        res.status(201).json({ medicalRecord });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar prontuário!', error });
    }
});

// Verificar prontuário
router.get('/medicalRecords/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const medicalRecord = await MedicalRecord.findOne({ userId });
        if(medicalRecord) res.status(200).json({ medicalRecord })
        else res.status(203).json({});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar prontuário!', error });
    }
});

// Atualizar prontuário
router.put('/medicalRecords/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const medicalRecord = await MedicalRecord.findOneAndUpdate({ _id: userId }, updateData, { new: true });
      if (medicalRecord) res.status(200).json({ medicalRecord });
      else res.status(404).json({ message: 'Prontuário não encontrado!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar prontuário!', error });
    }
});

// Cadastrar especialização
router.post('/specializations', async (req, res) => {
    try {
        const { userId, caregiverName, birthDate, gender, address, contactInfo, specializationArea, yearsOfExperience, qualifications, certificates } = req.body;
        const specialization = new Specialization({ userId, caregiverName, birthDate, gender, address, contactInfo, specializationArea, yearsOfExperience, qualifications, certificates });
        await specialization.save();
        res.status(201).json({ specialization });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar especialização!', error });
    }
});

// Verificar especialização
router.get('/specializations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const specialization = await Specialization.findOne({ userId });
        if(specialization) res.status(200).json({ specialization });
        else res.status(203).json({});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar especialização!', error });
    }
});

// Atualizar especialização
router.put('/specializations/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const specialization = await Specialization.findOneAndUpdate({ userId }, updateData, { new: true });
      if (specialization) res.status(200).json({ specialization });
      else res.status(404).json({ message: 'Especialização não encontrada!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar especialização!', error });
    }
});
  

// Cadastrar detalhes da localização
router.post('/locationDetails', async (req, res) => {
    try {
        const { userId, nursingHomeName, address, neighborhood, cep, contactInfo } = req.body;
        const locationDetails = new LocationDetails({ userId, nursingHomeName, address, neighborhood, cep, contactInfo });
        console.log(locationDetails)
        await locationDetails.save();
        res.status(201).json({ locationDetails} );
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar detalhes da localização!', error });
    }
});

// Verificar detalhes da localização
router.get('/locationDetails/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const locationDetails = await LocationDetails.findOne({ userId });
        if(locationDetails) res.status(200).json({ locationDetails });
        else res.status(203).json({});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar detalhes da localização!', error });
    }
});
  
// Atualizar detalhes da localização
router.put('/locationDetails/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const locationDetails = await LocationDetails.findOneAndUpdate({ userId }, updateData, { new: true });
      if (locationDetails) res.status(200).json({ locationDetails });
      else res.status(404).json({ message: 'Detalhes da localização não encontrado!' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar detalhes da localização!', error });
    }
});

export default router;