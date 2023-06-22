const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
})

db.on('error', (error) => {
    console.log('Mongo DB Connection Failed!');
})

module.exports = db;