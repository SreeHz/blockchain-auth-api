import os from 'os';
import { networkInterfaces } from 'os';

// Function to get local IP address
const getLocalIP = () => {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(net.address);
                return;
            }
        }
    }
};

getLocalIP();
