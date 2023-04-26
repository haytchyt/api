const mongoose = require("mongoose");

const ybsSchema = new mongoose.Schema({
    uniqueid: String,
    nsiNumber: String,
    surname: String,
    password: String,
    otp: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("YBS", ybsSchema);
