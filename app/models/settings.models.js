const mongoose = require("mongoose");

const Settings = mongoose.model(
  "Settings",
  new mongoose.Schema({
    status:String
  })
);

module.exports = Settings;
