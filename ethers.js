import { ethers } from 'ethers';

// Generate a new wallet
const wallet = ethers.Wallet.createRandom();

console.log('Private Key:', wallet.privateKey);  // NEVER share this in production!
console.log('Public Key:', wallet.address);       // Use this to register the user
