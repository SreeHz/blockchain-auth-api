import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import Nonce from '../models/Nonce.js';
import User from '../models/User.js';
import { logAuthenticationAttempt } from './ledgerController.js';  // Import Ledger Logging
import { getVPNStatus } from '../utils/vpnCheck.js'; // VPN detection
import { getRealIP } from '../utils/getRealIP.js'; // Local script to get real IP

/**
 * Generates a secure random nonce for authentication.
 */
export const generateNonce = async (req, res) => {
    const { userAddress } = req.body;

    if (!userAddress) {
        return res.status(400).json({ error: 'User address is required' });
    }

    // Check if the user's public key exists before generating a nonce
    const user = await User.findOne({ userAddress });
    if (!user) {
        return res.status(404).json({ error: 'Public key not registered. Please register first.' });
    }

    // Generate a secure random nonce
    const nonce = `0x${randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // Expires in 3 minutes

    // Store the nonce in MongoDB
    await Nonce.findOneAndUpdate(
        { userAddress },
        { nonce, expiresAt },
        { upsert: true, new: true }
    );

    res.status(200).json({ nonce, expiresAt });
};

/**
 * Verifies the signed nonce for authentication.
 */
export const verifyNonce = async (req, res) => {
    const { userAddress, signature } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Get user's IP

    if (!userAddress || !signature) {
        await logAuthenticationAttempt(userAddress, signature, 'FAILED - Missing parameters', ipAddress, false, null);
        return res.status(400).json({ error: 'User address and signature are required' });
    }

    const user = await User.findOne({ userAddress });
    if (!user) {
        await logAuthenticationAttempt(userAddress, signature, 'FAILED - Public key not registered', ipAddress, false, null);
        return res.status(404).json({ error: 'Public key not registered. Please register first.' });
    }

    const storedNonce = await Nonce.findOne({ userAddress });
    if (!storedNonce) {
        await logAuthenticationAttempt(userAddress, signature, 'FAILED - Nonce not found', ipAddress, false, null);
        return res.status(404).json({ error: 'Nonce not found. Please request a new nonce.' });
    }

    if (new Date() > storedNonce.expiresAt) {
        await logAuthenticationAttempt(userAddress, signature, 'FAILED - Nonce expired', ipAddress, false, null);
        return res.status(401).json({ error: 'Nonce expired. Please request a new nonce.' });
    }

    // Detect VPN
    const isVPN = await getVPNStatus(ipAddress);
    let realIpAddress = null;

    if (isVPN) {
        realIpAddress = await getRealIP(); // Fetch real IP if VPN detected
    }

    // Verify signature
    try {
        const recoveredAddress = ethers.verifyMessage(storedNonce.nonce, signature);

        if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
            await logAuthenticationAttempt(userAddress, signature, 'FAILED - Signature verification failed', ipAddress, isVPN, realIpAddress);
            return res.status(401).json({ error: 'Signature verification failed.' });
        }

        await logAuthenticationAttempt(userAddress, signature, 'SUCCESS', ipAddress, isVPN, realIpAddress);
        return res.status(200).json({ message: 'Authentication successful!' });

    } catch (error) {
        console.error('Signature verification error:', error);
        await logAuthenticationAttempt(userAddress, signature, 'FAILED - Server error', ipAddress, isVPN, realIpAddress);
        return res.status(500).json({ error: 'Error verifying signature. Please try again.' });
    }
};
