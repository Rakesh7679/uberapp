const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   const {fullname, email, password, vehical} = req.body;
   const hashedPassword = await captainModel.hashPassword(password);

   const captain = await captainService.createCaptain({
       firstname: fullname.firstname,
       lastname: fullname.lastname,
       email,
       password: hashedPassword,
       color: vehical.color,
       plate: vehical.plate,
       capacity: vehical.capacity,
       vehicalType: vehical.vehicalType
   });
   return res.status(201).json(captain);
};
