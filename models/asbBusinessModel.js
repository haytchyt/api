const mongoose = require("mongoose");

const asbBusinessSchema = new mongoose.Schema({
    uniqueid: String,
    userId: String,
    clientId: String,
    password: String,
    authCode: String,
    netcode: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("ASBBusiness", asbBusinessSchema);
