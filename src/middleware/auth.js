const jwt = require('jsonwebtoken');
const User = require('../models/Signup');
// const Cookies = require('cookies')

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            const user = jwt.verify(token,process.env.SECRET_KEY);
            req.userId = user.id
            console.log(user)
        }else{
            res.status(401).json({
                message : 'unauthorized user'
            })
        }
        next();
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;