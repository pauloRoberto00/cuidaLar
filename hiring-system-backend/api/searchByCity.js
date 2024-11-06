import mongoose from 'mongoose';
import User from '../models/User';
import MedicalRecord from '../models/MedicalRecord';
import Specialization from '../models/Specialization';
import LocationDetails from '../models/LocationDetails';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function searchByCity(req, res) {
  try {
    const { city, role } = req.params;
    await connectDb();

    const users = await User.find({ city, role });
    const result = await Promise.all(
      users.map(async (user) => {
        switch (role) {
          case 'patient':
            const medicalRecord = await MedicalRecord.findOne({ userId: user._id });
            return { ...user.toObject(), medicalRecord: medicalRecord ? medicalRecord.toObject() : null };
          case 'caregiver':
            const specialization = await Specialization.findOne({ userId: user._id });
            return { ...user.toObject(), specialization: specialization ? specialization.toObject() : null };
          case 'nursing-home':
            const locationDetails = await LocationDetails.findOne({ userId: user._id });
            return { ...user.toObject(), locationDetails: locationDetails ? locationDetails.toObject() : null };
          default:
            break;
        }
      })
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await searchByCity(req, res);
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}