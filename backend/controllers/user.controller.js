const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');



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
