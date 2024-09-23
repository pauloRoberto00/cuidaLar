import { Schema, model } from "mongoose";

const LocationDetailsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nursingHomeName: { type: String, required: true },
    address: { type: String, required: true },
    neighborhood: { type: String, required: true },
    cep: { type: String, required: true },
    contactInfo: { type: String, required: true }
});

export default model('LocationDetails', LocationDetailsSchema);