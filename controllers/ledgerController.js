import Ledger from '../models/Ledger.js';
import crypto from 'crypto';

/**
 * Logs an authentication attempt in the ledger.
 */
export const logAuthenticationAttempt = async (userAddress, signature, status) => {
    try {
        const ledgerEntry = new Ledger({
            userAddress,
            signature,
            status
        });

        await ledgerEntry.save();
        console.log(`✅ Ledger updated for ${userAddress} with status: ${status}`);
    } catch (error) {
        console.error('❌ Error logging authentication attempt:', error);
    }
};

/**
 * Fetches login history for a specific user.
 */
export const getUserLoginHistory = async (req, res) => {
    const { userAddress } = req.params;

    if (!userAddress) {
        return res.status(400).json({ error: 'User address is required' });
    }

    try {
        const history = await Ledger.find({ userAddress }).sort({ timestamp: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('❌ Error fetching login history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetches all authentication logs from the ledger.
 */
export const getAuthenticationLogs = async (req, res) => {
    try {
        const logs = await Ledger.find().sort({ timestamp: -1 }); // Fetch logs in descending order
        res.status(200).json(logs);
    } catch (error) {
        console.error('❌ Error fetching authentication logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Detects tampering by verifying stored hashes.
 */
export const detectTampering = async () => {
    try {
        const ledgerEntries = await Ledger.find();

        for (const entry of ledgerEntries) {
            const dataString = `${entry.userAddress}-${entry.timestamp}-${entry.signature}-${entry.status}`;
            const recalculatedHash = crypto.createHash('sha256').update(dataString).digest('hex');

            if (recalculatedHash !== entry.hash) {
                console.error(`🚨 Potential tampering detected for user: ${entry.userAddress}`);
                return { tampered: true, userAddress: entry.userAddress };
            }
        }

        return { tampered: false };
    } catch (error) {
        console.error('❌ Error detecting tampering:', error);
    }
};
