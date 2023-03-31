const express = require('express');
const app = express();
const router = express.Router();
const alert = require('alert');
const User = require('../models/Signup');
const Login = require('../models/Login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const dot = require('dotenv');
dot.config()

//AI data
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

router.use('/auth',auth,(req,res)=>{
    res.send('User valid')
})
//for summary
router.post('/open/ai', async (req, res) => {
    try {
        const { text } = req.body
        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Summarize this ${text}`,
            max_tokens: 500,
            temperature: 0.5,
        });
        if(data){
            if(data.choices[0].text){
                return res.status(200).json(data.choices[0].text)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

//for paragraph
router.post('/open/para', async (req, res) => {
    try {
        const { text } = req.body
        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `write a detail paragraph about ${text}`,
            max_tokens: 500,
            temperature: 0.5,
        });
        if(data){
            if(data.choices[0].text){
                return res.status(200).json(data.choices[0].text)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

//for chatbot
router.post('/open/chat', async (req, res) => {
    try {
        const { text } = req.body
        const { data } = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Answer question
            ${text}`,
            max_tokens: 500,
            temperature: 0.5,
        });
        if(data){
            if(data.choices[0].text){
                return res.status(200).json(data.choices[0].text)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

//js code converter
router.post('/open/code', async (req, res) => {
    try {
        const { text } = req.body
        const { data } = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: `/* convert it into javascript code \n
            ${text}`,
            max_tokens: 400,
            temperature: 0.25,
        });
        if(data){
            if(data.choices[0].text){
                return res.status(200).json(data.choices[0].text)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

//ai image converter
router.post('/open/image', async (req, res) => {
    try {
        const { text } = req.body
        const { data } = await openai.createImage({
            prompt: `generate a image ${text}`,
            n: 1,
            size: "1024x1024",
        });
        if(data){
            if(data.data[0].url){
                return res.status(200).json(data.data[0].url)
            }
        }
    } catch (error) {
        console.log(error)
    }
})
//AI data end here

router.post('/signup', async (req, res) => {
    const { name, email, password, cpassword, phone } = req.body;
    const userexist = await User.findOne({ email: email });
    try {
        if (userexist) {
            alert('User already exist');
        } else {
            if (password == cpassword) {
                const signData = new User({
                    name: name,
                    email: email,
                    password: password,
                    cpassword: cpassword,
                    phone: phone
                })
                const token = await signData.generateAuthToken();
                res.cookie('jwt',token,{
                    expires:new Date(Date.now() + 600000),
                    httpOnly: true
                })
                await signData.save();
                res.json('exist')
            //  const tokens =   jwt.sign({email : signData.email, id: signData._id},process.env.SECRET_KEY)
            //     res.status(201).json({user:signData, token:tokens})
            }
            else {
                res.json('no exist');
            }
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    const { logmail, logpassword } = req.body;
    const Compare = await User.findOne({ email: logmail });
    const isMatch = await bcrypt.compare(logpassword, Compare.password);
    const token = await Compare.generateAuthToken();
    res.cookie('jwt',token,{
        expires:new Date(Date.now() + 600000),
        httpOnly: true
    })
    try {
        if (isMatch) {
            res.status(201).json({ message: 'exist' })
        } else {
            res.status(400).json({ error: 'notexist' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/logout',(req,res)=>{
    res.clearCookie();
    res.status(201).json({
        message: "Logout successfully"
    })
})

module.exports = router;