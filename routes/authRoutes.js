import express from 'express';
import { generateNonce, verifyNonce } from '../controllers/authController.js';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// Nonce Generation
router.post('/generate-nonce', generateNonce);

// Nonce Verification
router.post('/verify-nonce', verifyNonce);

export default router;
