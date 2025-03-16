import mongoose from 'mongoose';

const nonceSchema = new mongoose.Schema({
    userAddress: { type: String, required: true, unique: true },  // Public key or wallet address
    nonce: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

export default mongoose.model('Nonce', nonceSchema);
