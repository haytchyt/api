const mongoose = require("mongoose");

const wiseSchema = new mongoose.Schema({
    uniqueid: String,
    email: String,
    password: String,
    otp: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("Wise", wiseSchema);
