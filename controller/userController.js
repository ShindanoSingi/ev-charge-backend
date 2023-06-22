const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


// Create a new user
const registerUser = asyncHandler(async (req, res) => {

    try {
        const { username, password } = req.body

        // Validate user input
        const user = await User.findOne({ username });
        if (user) {
            return res.send({
                message: 'Username already exists',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();

        return res.send({
            message: 'User registered successfully',
            success: true,
        });
    }
    catch (error) {
        return res.send({
            message: error.message,
            success: false,
        });
    }
}
);

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.send({
                message: 'Invalid password',
                success: false,
            });
        }

        if (req.body.username !== user.username) {
            return res.send({
                message: 'Invalid username',
                success: false,
            });
        }

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.send({
            success: true,
            message: 'User logged in successfully',
            user: user.username,
            token: token
        });
    } catch (error) {
        return res.send({
            message: 'User not found',
            success: false,
        });
    };
}
);

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User?.findById(_id);
    try {
        if (!user) {
            return res.send({
                message: 'User not found',
                success: false,
            });
        }
        res.send({
            message: 'User fetched successfully',
            success: true,
            data: user,
        });

    } catch (error) {
        res.send({
            message: 'User not found',
            success: false,
        });
    }
}
);

module.exports = { registerUser, loginUser, getCurrentUser };
