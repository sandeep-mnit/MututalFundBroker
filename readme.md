# node Project

Mutual Fund Broker Web Application

### Developer installation guide

Clone the files
Donload MongoDB if not available, go to below place
(C:\Program Files\MongoDB\Server\4.4\bin ) and run cmd from bin
and start the MongoDB server locally by command: mongod

Install all dependency using below command from base location (from app.js file location)
npm install

Start the nodeJS server by running below command from app.js file location
npm start

### EndPoints

1. /login
   --> for login page
   type: POST
   req: email, password

2. /register
   --> for register page
   type: POST
   req: email, password

3. /viewData
   --> to get Mutual Fund Data
   type: POST
   req: MutualFundFamily
   res: json Data
   <!-- [{
    "Scheme_Code": 119551,
    "ISIN_Div_Payout_ISIN_Growth": "INF209KA12Z1",
    "ISIN_Div_Reinvestment": "INF209KA13Z9",
    "Scheme_Name": "Aditya Birla Sun Life Banking & PSU Debt Fund  - DIRECT - IDCW",
    "Net_Asset_Value": 102.5842,
    "Date": "08-Jan-2025",
    "Scheme_Type": "Open Ended Schemes",
    "Scheme_Category": "Debt Scheme - Banking and PSU Fund",
    "Mutual_Fund_Family": "Aditya Birla Sun Life Mutual Fund"
    }] -->

4. /portfolio
   --> to get Mutual Fund Data
   type: POST
   req: user ID
   res: json data
   <!-- Sample Portfolio
    [
        {
        "_id": "portfolioId1",
        "userId": "userId1",
        "schemeId": {
            "_id": "schemeId1",
            "fund_family": "Fund Family A",
            "scheme_name": "Scheme A",
            "current_value": 120.5,
            "last_updated": "2025-01-07T10:00:00Z"
        },
        "units": 10,
        "invested_amount": 1000,
        "current_value": 1205
        }
    ] -->

### Cron

schedule cron to update all portfolios per hour

### Port

> 8000
