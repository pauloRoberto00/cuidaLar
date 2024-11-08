import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, required: true },
    authorUserId: { type: String, required: true },
    authorUserName: { type: String, required: true },
    date: { type: Date, required: true }
});

export default model('Comment', commentSchema);
