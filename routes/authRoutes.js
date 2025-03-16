import express from 'express';
import { generateNonce } from '../controllers/authController.js';

const router = express.Router();

// Endpoint for nonce generation
router.post('/generate-nonce', generateNonce);

export default router;
