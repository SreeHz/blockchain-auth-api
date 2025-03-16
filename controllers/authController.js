import { randomBytes } from 'crypto';
import Nonce from '../models/Nonce.js';

/**
 * Generates a secure random nonce and stores it with a short expiry time.
 */
export const generateNonce = async (req, res) => {
    const { userAddress } = req.body;

    if (!userAddress) {
        return res.status(400).json({ error: 'User address is required' });
    }

    // Generate a secure random nonce (32-byte hexadecimal string)
    const nonce = `0x${randomBytes(32).toString('hex')}`;

    // Set nonce expiry (e.g., 3 mins)
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    // Store the nonce in MongoDB
    await Nonce.findOneAndUpdate(
        { userAddress },
        { nonce, expiresAt },
        { upsert: true, new: true }
    );

    res.status(200).json({ nonce, expiresAt });
};
