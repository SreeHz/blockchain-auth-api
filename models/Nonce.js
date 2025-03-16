import mongoose from 'mongoose';

const nonceSchema = new mongoose.Schema({
    userAddress: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

export default mongoose.model('Nonce', nonceSchema);
