import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getVPNStatus = async (ip) => {
    try {
        const response = await axios.get(`https://ipqualityscore.com/api/json/ip/${process.env.VPN_API_KEY}/${ip}`);
        return response.data.vpn || false; // Returns true if VPN is detected
    } catch (error) {
        console.error('VPN detection error:', error);
        return false; // Assume non-VPN if API fails
    }
};
