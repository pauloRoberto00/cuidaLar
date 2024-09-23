import { Schema, model } from "mongoose";

const SpecializationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caregiverName: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    contactInfo: { type: String, required: true },
    specializationArea: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    qualifications: { type: String, required: true },
    certificates: { type: String, required: true }
});

export default model('Specialization', SpecializationSchema);