const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    cpassword: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

});

signupSchema.pre('save', async function (next) {
    if (this.isModified) {
        this.password = await bcrypt.hash(this.password, 10)
        this.cpassword = await bcrypt.hash(this.password, 10)
    }
    next();
})

signupSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        // await this.save();
        return token
    } catch (error) {
        console.log(error)
    }
}

const User = new mongoose.model('Signup', signupSchema);
module.exports = User;