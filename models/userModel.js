const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    stations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Station' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
