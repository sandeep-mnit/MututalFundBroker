var mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mutual_funds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB.'));

// Models
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const fundSchema = new mongoose.Schema({
    fund_family: { type: String, required: true },
    scheme_name: { type: String, required: true },
    current_value: { type: Number, required: true },
    last_updated: { type: Date, required: true },
});

// Here userId refers to the objecct Id in User model
// Here schemeId refers to the objecct Id in Fund model
const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fund', required: true },
    units: { type: Number, required: true },
    invested_amount: { type: Number, required: true },
    current_value: { type: Number, required: true },
});

const User = mongoose.model('User', userSchema);
const Fund = mongoose.model('Fund', fundSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = { User : User,Fund : Fund, Portfolio : Portfolio}