const mongoose = require("mongoose");

const Kandidat = mongoose.model(
  "Kandidat",
  new mongoose.Schema({
    nourut:String,
    nama: String,
    visi: String,
    misi: String
  })
);

module.exports = Kandidat;
