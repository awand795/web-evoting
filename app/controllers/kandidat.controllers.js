const db = require("../models");
const Kandidat = db.kandidat;
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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
    // Hapus file foto & video jika ada
    const uploadsDir = path.join(__basedir, "resources", "static", "assets", "uploads");
    if (data.foto) {
      const fotoPath = path.join(uploadsDir, path.basename(data.foto));
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }
    if (data.videoVisiMisi) {
      const videoPath = path.join(uploadsDir, path.basename(data.videoVisiMisi));
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }
    res.send({ message: "Success" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error deleting kandidat." });
  }
};

exports.uploadFoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "File foto tidak ditemukan." });
    }
    const id = req.params.id;
    const kandidat = await Kandidat.findById(id);
    if (!kandidat) {
      return res.status(404).send({ message: "Kandidat not found." });
    }

    // Hapus foto lama jika ada
    const uploadsDir = path.join(__basedir, "resources", "static", "assets", "uploads");
    if (kandidat.foto) {
      const oldPath = path.join(uploadsDir, path.basename(kandidat.foto));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const fotoUrl = `/resources/static/assets/uploads/${req.file.filename}`;
    kandidat.foto = fotoUrl;
    await kandidat.save();
    res.send({ message: "Foto berhasil diupload!", foto: fotoUrl });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error uploading foto." });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "File video tidak ditemukan." });
    }
    const id = req.params.id;
    const kandidat = await Kandidat.findById(id);
    if (!kandidat) {
      return res.status(404).send({ message: "Kandidat not found." });
    }

    // Hapus video lama jika ada
    const uploadsDir = path.join(__basedir, "resources", "static", "assets", "uploads");
    if (kandidat.videoVisiMisi) {
      const oldPath = path.join(uploadsDir, path.basename(kandidat.videoVisiMisi));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const videoUrl = `/resources/static/assets/uploads/${req.file.filename}`;
    kandidat.videoVisiMisi = videoUrl;
    await kandidat.save();
    res.send({ message: "Video berhasil diupload!", videoVisiMisi: videoUrl });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error uploading video." });
  }
};

exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "File Excel tidak ditemukan." });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      return res.status(400).send({ message: "File Excel kosong." });
    }

    const docs = rows.map((row) => ({
      nourut: String(row["No Urut"] || row["nourut"] || "").trim(),
      nama: String(row["Nama"] || row["nama"] || "").trim(),
      visi: String(row["Visi"] || row["visi"] || "").trim(),
      misi: String(row["Misi"] || row["misi"] || "").trim(),
      foto: null,
    }));

    const invalid = docs.filter((d) => !d.nourut || !d.nama);
    if (invalid.length) {
      return res.status(400).send({
        message: `${invalid.length} baris tidak valid (No Urut dan Nama wajib diisi).`,
      });
    }

    await Kandidat.insertMany(docs);
    res.send({ message: `${docs.length} kandidat berhasil diimport!` });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error importing excel." });
  }
};

exports.downloadTemplate = (req, res) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ["No Urut", "Nama", "Visi", "Misi"],
    ["1", "Nama Kandidat A", "Visi kandidat A", "Misi kandidat A"],
    ["2", "Nama Kandidat B", "Visi kandidat B", "Misi kandidat B"],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kandidat");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", "attachment; filename=template_kandidat.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buf);
};
