const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cron = require('node-cron');
const cookieParser = require('cookie-parser')
const path = require("path");
const UserCtrl = require('../controller/users.js');
const MFFService = require('../service/MFFService.js');
const Constants = require('../config/constant.js');
var {User ,Fund, Portfolio} = require('../models/MFFDB.js');

const app = express();
router.use(cookieParser());


router.get('/',(req,res)=>{

    try {
        const verified = jwt.verify(req.cookies.jwt, Constants.JWT_SECRET_KEY);
        console.log('Verified JWT');
        
        return res.sendFile(path.resolve('views/home.html'));
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.sendFile(path.resolve('views/login.html'))
    }
    res.sendFile(path.resolve('views/login.html'))
})


// Register
router.get('/register',(req,res)=>{
    res.sendFile(path.resolve('views/signup.html'))
})

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserCtrl.UserRegister({ email, password });
        if (user==1) return res.json({ error: 'User already exist' });
        const token = jwt.sign({ userId: user._id }, Constants.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie("jwt",token,{maxAge: "600000", httpOnly :true});
        res.sendFile(path.resolve('views/home.html'));
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserCtrl.UserLogin({ email, password });
        if (user=='User not found.') return res.status(404).json({ error: 'User not found.' });

        if (user=='Invalid credentials.') return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ userId: user._id }, Constants.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie("jwt",token,{maxAge: "600000"});
        res.sendFile(path.resolve('views/home.html'));
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});


router.post('/viewData', async (req, res) => {
    try {
        const verified = jwt.verify(req.cookies.jwt, Constants.JWT_SECRET_KEY);
        console.log('Verified JWT');
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.sendFile(path.resolve('views/login.html'))
    }
    const family = req.body.MutualFundFamily; // Get the mutual fund family from the request body
    try {
        const MFFData = await UserCtrl.ViewData({ family });
        console.log("MFFData", MFFData);
        res.json(MFFData);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch funds.' });
    }
});

// View Portfolio
router.get('/portfolio', async (req, res) => {
    // Pass the signed user ID in header and all portfolio of that user ID will be fetched
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, Constants.JWT_SECRET_KEY);
        const userId = decoded.userId;
        const portfolio = await UserCtrl.Portfolio({userId});     
        res.json(portfolio);
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Unauthorized.' });
    }
});


// Hourly Portfolio Tracking
try {
    MFFService.CronService();
} catch (error) {
    console.log(error)
}

  
module.exports = router;