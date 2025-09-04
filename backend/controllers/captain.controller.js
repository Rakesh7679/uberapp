const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   const {fullname, email, password, vehicle} = req.body;
   const isCaptainAlreadyExist = await captainService.getCaptainByEmail(email);
   if (isCaptainAlreadyExist) {
       return res.status(409).json({ message: 'Captain with this email already exists' });
   }

   const hashedPassword = await captainModel.hashPassword(password);

   const captain = await captainService.createCaptain({
       firstname: fullname.firstname,
       lastname: fullname.lastname,
       email,
       password: hashedPassword,
       color: vehicle.color,
       plate: vehicle.plate,
       capacity: vehicle.capacity,
       vehicleType: vehicle.vehicleType
   });
   const token = captain.generateAuthToken();
   return res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token );
    return res.status(200).json({ captain, token });
}
module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        const captain = req.captain;
        if (!captain) {
            return res.status(404).json({ error: 'Captain not found' });
        }
        return res.status(200).json({ captain });
    } catch (error) {
        console.error('Error in getCaptainProfile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];
       await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in logoutCaptain:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
