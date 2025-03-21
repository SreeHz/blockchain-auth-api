import express from 'express';
import { generateNonce, verifyNonce } from '../controllers/authController.js';
import { registerUser } from '../controllers/userController.js';
import { getAuthenticationLogs } from '../controllers/ledgerController.js'; // Import Ledger Logs

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// Nonce Generation
router.post('/generate-nonce', generateNonce);

// Nonce Verification
router.post('/verify-nonce', verifyNonce);

// Fetch Authentication Logs
router.get('/auth-logs', getAuthenticationLogs);

export default router;
