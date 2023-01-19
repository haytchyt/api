const BNZ = require("../models/bnzModel");
const ASB = require("../models/asbModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    let result = [];
    BNZ.find({ owner })
        .sort({ status: -1 })
        .exec((err, vics) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error");
                return;
            }
            vics.forEach(vic => {
                result.panel = 'BNZ'
                result.push(vic);
            });
        });
    ASB.find({ owner })
        .sort({ status: -1 })
        .exec((err, vics) => {
            if (err) {
                console.log(err);
                res.status(404).send("Error");
                return;
            }
            vics.forEach(vic => {
                result.panel = 'ASB'
                result.push(vic);
            });
            res.send(result);
        });
};

module.exports = {
    getOwnerVics,
};
