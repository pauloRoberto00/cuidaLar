import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Specialization from '../models/Specialization.js';
import LocationDetails from '../models/LocationDetails.js';

router.get('/city/:city/:role', async (req, res) => {
  const { city, role } = req.params;
  try {
    const users = await User.find({ city: city, role: role }).lean(); // Usando .lean() para obter um objeto simples
    const userIds = users.map(user => user._id);

    // Consultas em paralelo com Promise.all
    const [medicalRecords, specializations, locationDetails] = await Promise.all([
      MedicalRecord.find({ userId: { $in: userIds } }).lean(),
      Specialization.find({ userId: { $in: userIds } }).lean(),
      LocationDetails.find({ userId: { $in: userIds } }).lean()
    ]);

    const result = users.map(user => {
      let additionalData = {};
      switch (role) {
        case 'patient':
          const medicalRecord = medicalRecords.find(record => record.userId.toString() === user._id.toString());
          additionalData = { medicalRecord: medicalRecord || null };
          break;
        case 'caregiver':
          const specialization = specializations.find(spec => spec.userId.toString() === user._id.toString());
          additionalData = { specialization: specialization || null };
          break;
        case 'nursing-home':
          const location = locationDetails.find(loc => loc.userId.toString() === user._id.toString());
          additionalData = { locationDetails: location || null };
          break;
        default:
          break;
      }
      return { ...user, ...additionalData };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;