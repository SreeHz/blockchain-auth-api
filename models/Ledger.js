import mongoose from 'mongoose';
import crypto from 'crypto';

const ledgerSchema = new mongoose.Schema({
    userAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    signature: { type: String, required: true },
    ipAddress: { type: String, required: true }, // Store IP address
    isVPN: { type: Boolean, default: false }, // VPN status
    realIpAddress: { type: String, default: null }, // Real IP if VPN detected
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    hash: { type: String, required: true }
});

// Pre-save hook to generate a unique hash for integrity verification
ledgerSchema.pre('save', function (next) {
    const dataString = `${this.userAddress}-${this.timestamp}-${this.signature}-${this.status}-${this.ipAddress}-${this.isVPN}-${this.realIpAddress}`;
    this.hash = crypto.createHash('sha256').update(dataString).digest('hex');
    next();
});

export default mongoose.model('Ledger', ledgerSchema);
