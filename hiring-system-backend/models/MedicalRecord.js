import { Schema, model } from "mongoose";

const MedicalRecordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    contactInfo: { type: String, required: true },
    medicalHistory: { type: String, required: true },
    allergies: { type: String, required: true },
    medications: { type: String, required: true },
    emergencyContact: { type: String, required: true },
});

export default model('MedicalRecord', MedicalRecordSchema);