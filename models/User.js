import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userAddress: { type: String, required: true, unique: true },  // Public key / Wallet address
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
