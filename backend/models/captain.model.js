const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehical: {
        color: {
            type: String,
            required: true
        },
        plate: {
            type: String,
            required: true
        },
       capacity: {
           type: Number,
           required: true,
           min: [1, 'Capacity must be at least 1']
       },
       vehicalType: {
           type: String,
           required: true,
           enum: ['car', 'motorcycle', 'auto'],
          
       }
    },
    location: {
        lat: {
            type: Number
           
        },
        lng: {
            type: Number,
          
        }
    }
});

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
captainSchema.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};
captainSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const captainModel = mongoose.model('Captain', captainSchema);

module.exports = captainModel;

