const axios = require('axios');
const cron = require('node-cron');
const Constants = require('../config/constant.js');
var {User ,Fund, Portfolio} = require('../models/MFFDB.js');


class MFFService {

    static async GetRapidAPIData({family}){
        try {
            console.log("Calling Rapid API");
            const url = `https://${Constants.RAPIDAPI_HOST}/latest?Mutual_Fund_Family=${family}&Scheme_Type=Open`;
            var config = {
                method: 'get',
                url: url,
                headers: { 
                    'x-rapidapi-key': Constants.RAPIDAPI_KEY, 
                    'x-rapidapi-host': Constants.RAPIDAPI_HOST
                }
            };

            const response = await axios(config);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async CronService(){
        cron.schedule('0 * * * *', async () => {
            // All portfolios are updated per hour
            console.log('Updating portfolio values...');
            try {
        
                const portfolios = await Portfolio.find().populate('schemeId');
                for (const portfolio of portfolios) {
                    const family = portfolio.schemeId.fund_family
                    const url = `https://${Constants.RAPIDAPI_HOST}/latest?Mutual_Fund_Family=${family}&Scheme_Type=Open`;
                    const response = await axios.get(url, {
                        method: 'get',
                        url: url,
                        headers: { 
                            'x-rapidapi-key': Constants.RAPIDAPI_KEY, 
                            'x-rapidapi-host': Constants.RAPIDAPI_HOST
                        },
                        params: { scheme: portfolio.schemeId.scheme_name },
                    });
                    const currentValue = response.data.current_value;
                    portfolio.current_value = currentValue * portfolio.units;
                    await portfolio.save();
                }
                console.log('Portfolio updated successfully.');
            } catch (error) {
              console.error('Error updating portfolio:', error.message);
              throw error
            }
        });
    }
}

module.exports = MFFService;