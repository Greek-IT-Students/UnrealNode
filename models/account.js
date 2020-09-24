const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    data: {
        type: {},
        default: {}
    }
});

module.exports = mongoose.model('Account', schema);