const mongoose = require("mongoose");

const coopSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    secCode: String,
    smsOtp: Boolean,
    status: Number,
    ip: String,
    owner: String,
    secCodeIndex: String,
});

module.exports = mongoose.model("COOP", coopSchema);
