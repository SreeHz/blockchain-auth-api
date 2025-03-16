import { ethers } from 'ethers';
import Nonce from '../models/Nonce.js';

/**
 * Verifies the signed nonce for authentication.
 */
export const verifyNonce = async (req, res) => {
    const { userAddress, signature } = req.body;

    if (!userAddress || !signature) {
        return res.status(400).json({ error: 'User address and signature are required' });
    }

    // Fetch the stored nonce for the given address
    const storedNonce = await Nonce.findOne({ userAddress });

    if (!storedNonce) {
        return res.status(404).json({ error: 'Nonce not found. Please request a new nonce.' });
    }

    // Check if nonce has expired
    if (new Date() > storedNonce.expiresAt) {
        return res.status(401).json({ error: 'Nonce expired. Please request a new nonce.' });
    }

    // Verify signature
    try {
        const recoveredAddress = ethers.verifyMessage(storedNonce.nonce, signature);

        if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
            return res.status(401).json({ error: 'Signature verification failed.' });
        }

        // Successful verification — consider user authenticated
        res.status(200).json({ message: 'Authentication successful!' });

    } catch (error) {
        console.error('Signature verification error:', error);
        res.status(500).json({ error: 'Error verifying signature. Please try again.' });
    }
};
