const db = require("../models");
const Kandidat = db.kandidat;

exports.createKandidat = async (req, res) => {
  try {
    const kandidat = new Kandidat({
      nourut: req.body.nourut,
      nama: req.body.nama,
      foto: req.body.foto || null,
      visi: req.body.visi,
      misi: req.body.misi
    });

    await kandidat.save();
    res.send({ message: "Kandidat berhasil ditambahkan!" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error creating kandidat." });
  }
};

exports.getAllKandidat = async (req, res) => {
  try {
    const data = await Kandidat.find({});
    res.send({ data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching kandidat." });
  }
};

exports.getFindKandidat = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Kandidat.findById(id);
    if (!data) {
      return res.status(404).send({ message: "Kandidat not found." });
    }
    res.send({ data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error fetching kandidat." });
  }
};

exports.editKandidat = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Kandidat.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      return res.status(404).send({ message: "Kandidat not found." });
    }
    res.send({ message: "Success", data: data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error updating kandidat." });
  }
};

exports.deleteKandidat = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Kandidat.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send({ message: "Kandidat not found." });
    }
    res.send({ message: "Success" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error deleting kandidat." });
  }
};
