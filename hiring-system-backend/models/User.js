import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'caregiver', 'nursing-home'], required: true },
});

export default model('User', userSchema);