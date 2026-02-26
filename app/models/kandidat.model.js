const mongoose = require("mongoose");

const Kandidat = mongoose.model(
  "Kandidat",
  new mongoose.Schema({
    nourut: String,
    nama: String,
    foto: String,
    videoVisiMisi: String,
    visi: String,
    misi: String
  })
);

module.exports = Kandidat;
