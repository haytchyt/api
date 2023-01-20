const BNZ = require("../models/bnzModel");
const ASB = require("../models/asbModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    let result = [];
    let bnzVics = await BNZ.find({ owner })
        .sort({ status: -1 })
    let asbVics = await ASB.find({ owner })
        .sort({ status: -1 })
    if (bnzVics.length) {
        result.push(bnzVics)
    }
    if (asbVics.length) {
        result.push(asbVics)
    }
    res.send(result)
};

module.exports = {
    getOwnerVics,
};
