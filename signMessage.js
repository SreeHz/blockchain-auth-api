// Add this at the top of signMessage.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { ethers } from 'ethers';
const axios = require('axios'); // Axios requires `require()` in ESM

const PRIVATE_KEY = '0x4f6dd8d8b7d212a30108af3d9d28399478216d019d99335fd4103a8d4616a5a4';  // Replace this
const USER_ADDRESS = '0x8E7363412fDdeD7970306BCe8bfD4e19665e5f9B';  // Replace this
const API_URL = 'https://blockchain-auth-api.onrender.com/api/auth';    // Update if deployed

const signNonce = async () => {
    // Step 1: Request a Nonce from the Server
    const nonceResponse = await axios.post(`${API_URL}/generate-nonce`, { userAddress: USER_ADDRESS });
    const nonce = nonceResponse.data.nonce;

    console.log('Received Nonce:', nonce);

    // Step 2: Sign the Nonce
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const signature = await wallet.signMessage(nonce);

    console.log('Generated Signature:', signature);

    // Step 3: Send Signature for Verification
    const verifyResponse = await axios.post(`${API_URL}/verify-nonce`, {
        userAddress: USER_ADDRESS,
        signature: signature
    });

    console.log('Verification Response:', verifyResponse.data);
};

signNonce().catch(console.error);
