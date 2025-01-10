const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const Constants = require('../config/constant.js');
const MFFService = require('../service/MFFService.js');
var {User ,Fund, Portfolio} = require('../models/MFFDB.js');

const app = express();
router.use(cookieParser());


class UserCtrl {

    static async UserRegister({ email, password }){
        try {
            var user = await User.findOne({ email });
            if (user) return 1;
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({ email, password: hashedPassword });
            await user.save();
            console.log("User Registered");
            return user;
        } catch (err) {
            throw err;
        }
    }

    static async UserLogin({ email, password }){
        try {
            const user = await User.findOne({ email });
            if (!user) return 'User not found.';

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return 'Invalid credentials.';
            console.log("User Logged in");

            return user;
        } catch (err) {
            throw err;
        }
    }

    static async ViewData({ family }){
        
        try {
            const response = await MFFService.GetRapidAPIData({family});
            console.log("Successfully Fetched Mutual Fund Data" )
            return response;
        } catch (err) {
            throw err;
        }
    }

    // Sample Mutual Fund Data
    // [{
    //     "Scheme_Code": 119551,
    //     "ISIN_Div_Payout_ISIN_Growth": "INF209KA12Z1",
    //     "ISIN_Div_Reinvestment": "INF209KA13Z9",
    //     "Scheme_Name": "Aditya Birla Sun Life Banking & PSU Debt Fund  - DIRECT - IDCW",
    //     "Net_Asset_Value": 102.5842,
    //     "Date": "08-Jan-2025",
    //     "Scheme_Type": "Open Ended Schemes",
    //     "Scheme_Category": "Debt Scheme - Banking and PSU Fund",
    //     "Mutual_Fund_Family": "Aditya Birla Sun Life Mutual Fund"
    // }]

    static async Portfolio({userId}){
        try {
            const portfolio = await Portfolio.find({ userId }).populate('schemeId');
            return portfolio;
        } catch (err) {
            throw err;
        }
    }
    // Sample Portfolio
    // [
    //     {
    //       "_id": "portfolioId1",
    //       "userId": "userId1",
    //       "schemeId": {
    //         "_id": "schemeId1",
    //         "fund_family": "Fund Family A",
    //         "scheme_name": "Scheme A",
    //         "current_value": 120.5,
    //         "last_updated": "2025-01-07T10:00:00Z"
    //       },
    //       "units": 10,
    //       "invested_amount": 1000,
    //       "current_value": 1205
    //     }
    // ]
}

module.exports = UserCtrl;