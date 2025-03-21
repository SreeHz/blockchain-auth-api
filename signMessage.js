// Add this at the top of signMessage.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { ethers } from 'ethers';
const axios = require('axios'); // Axios requires `require()` in ESM

const PRIVATE_KEY = '0xa3655a7a6b9539a2489cb5461b44b84eee4cc76b03a92911d11c8c436499b880';  // Replace this
const USER_ADDRESS = '0x876eB6E4c5F51D341676A472f5557F6836948C4E';  // Replace this
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
