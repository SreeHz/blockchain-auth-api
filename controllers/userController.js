import User from '../models/User.js';

/**
 * Registers a new user with their public key.
 */
export const registerUser = async (req, res) => {
    const { userAddress } = req.body;

    if (!userAddress) {
        return res.status(400).json({ error: 'User address is required' });
    }

    // Check if the user is already registered
    const existingUser = await User.findOne({ userAddress });
    if (existingUser) {
        return res.status(400).json({ error: 'User already registered' });
    }

    // Register the new user
    const newUser = new User({ userAddress });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
};
