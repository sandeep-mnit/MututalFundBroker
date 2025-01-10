const express = require("express");
// const path = require("path");
const app = express();
const bodyparser  = require("body-parser");
const PORT = 8000;

var route = require('./src/route/users.js');


//EXPRESS SPECIFIC STUFF
app.use('/public', express.static('public')); // For serving static files
app.use(express.urlencoded());
app.use(bodyparser.json());

app.use('/',route)

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));