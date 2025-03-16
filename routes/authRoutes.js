import express from 'express';
import { generateNonce, verifyNonce } from '../controllers/authController.js';

const router = express.Router();

// Nonce Generation
router.post('/generate-nonce', generateNonce);

// Nonce Verification
router.post('/verify-nonce', verifyNonce);

export default router;
