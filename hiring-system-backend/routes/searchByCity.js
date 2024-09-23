import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Specialization from '../models/Specialization.js';
import LocationDetails from '../models/LocationDetails.js';

router.get('/city/:city/:role', async (req, res) => {
  try {
    const city = req.params.city;
    const role = req.params.role;
    const users = await User.find({ city: city, role: role });
    const result = await Promise.all(users.map(async user => {
      switch(role){
        case 'patient':
          const medicalRecord = await MedicalRecord.findOne({ userId: user._id });
          return {
            ...user.toObject(),
            medicalRecord: medicalRecord ? medicalRecord.toObject() : null
          };
        case 'caregiver':
          const specialization = await Specialization.findOne({ userId: user._id });
          return {
            ...user.toObject(),
            specialization: specialization ? specialization.toObject() : null
          };
        case 'nursing-home':
          const locationDetails = await LocationDetails.findOne({ userId: user._id });
          return {
            ...user.toObject(),
            locationDetails: locationDetails ? locationDetails.toObject() : null
          };
        default: 
          break;
      }
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;