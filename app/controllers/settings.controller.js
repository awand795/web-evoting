const db = require("../models");
const Settings = db.settings;

exports.getSettingsStatus = async (req, res) => {
  try {
    const data = await Settings.find({});
    res.send({ data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching settings." });
  }
};

exports.editSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Settings.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      return res.status(404).send({ message: "Settings not found." });
    }
    res.send({ message: "Success", data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error updating settings." });
  }
};
