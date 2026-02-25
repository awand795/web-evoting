const mongoose = require("mongoose");

const Vote = mongoose.model(
  "Vote",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true  // satu user hanya bisa vote satu kali
      },
      kandidat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kandidat",
        required: true
      }
    },
    { timestamps: true }
  )
);

module.exports = Vote;
