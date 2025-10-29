const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.CONNECTION_STRING).then(() => {
            console.log('MongoDB connected');
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
