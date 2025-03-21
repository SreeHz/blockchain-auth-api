import { execSync } from 'child_process';

export const getRealIP = () => {
    try {
        const realIP = execSync('node scripts/getRealIP.js').toString().trim();
        return realIP;
    } catch (error) {
        console.error('Error fetching real IP:', error);
        return null;
    }
};
