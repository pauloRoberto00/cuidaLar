import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true }
});

export default model('Comment', commentSchema);
