const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');



module.exports.registerUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);

        const {fullname, email, password} = req.body;
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname:fullname.firstname,
            lastname:fullname.lastname,
            email,
            password: hashedPassword
        });
        const token = user.generateAuthToken();
        return res.status(201).json({ user, token });
    } catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports.loginUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token', token );
        return res.status(200).json({ user, token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        return res.status(500).json({ error: error.message });
    }    
}

module.exports.getUserProfile = async(req, res, next) => {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.logoutUser = async(req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.header('Authorization').split(' ')[1];
        await blackListTokenModel.create({ token });
        

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in logoutUser:', error);
        return res.status(500).json({ error: error.message });
    }
}
