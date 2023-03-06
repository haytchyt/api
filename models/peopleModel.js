const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    pin: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("People", peopleSchema);
