const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ error: 'Unauthorized' });        
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authUser:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ error: 'Captain not found' });
        }
        req.captain = captain;
        next();
    } catch (error) {
        console.error('Error in authCaptain:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}