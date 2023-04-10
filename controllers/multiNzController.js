const BNZ = require("../models/bnzModel");
const ASB = require("../models/asbModel");
const Kiwi = require("../models/kiwiModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    let result = new Array();
    BNZ.find({ owner }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        vic.forEach((v) => {
            result.push(v)
        })
        ASB.find({ owner }).exec((err, vic) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error");
                return;
            }
            vic.forEach((v) => {
                result.push(v)
            })
            Kiwi.find({ owner }).exec((err, vic) => {
                if (err) {
                    console.log(err);
                    res.status(404).send("Error");
                    return;
                }
                vic.forEach((v) => {
                    result.push(v)
                })
                res.send(result)
            })
        })
    });
};

module.exports = {
    getOwnerVics,
};
