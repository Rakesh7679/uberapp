const mongoose = require('mongoose');
function connectToDb(){
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
module.exports = connectToDb;