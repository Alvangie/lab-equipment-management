const User = require('../models/User');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser.id,
            email: newUser.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during registration', details: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            token: 'mock-jwt-token-for-lab-system'
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during login', details: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};