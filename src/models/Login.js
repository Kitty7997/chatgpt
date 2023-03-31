const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    logmail: {
        type: String,
        required: true
    },
    logpassword: {
        type: String,
        required: true
    }
});

const Login = new mongoose.model('Login', logSchema);
module.exports = Login;