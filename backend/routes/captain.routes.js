const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');


router.post('/register', [
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehical.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehical.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehical.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehical.vehicalType').notEmpty().withMessage('Vehicle type is required')
], captainController.registerCaptain);

module.exports = router;
