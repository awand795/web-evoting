const db = require("../models");
const Vote = db.vote;
const User = db.user;
const Kandidat = db.kandidat;
const Settings = db.settings;

// POST /api/vote - User cast a vote
exports.castVote = async (req, res) => {
  try {
    const userId = req.userId;
    const { kandidatId } = req.body;

    if (!kandidatId) {
      return res.status(400).send({ message: "kandidatId wajib diisi." });
    }

    // Cek apakah voting sedang dibuka
    const settings = await Settings.findOne({});
    if (!settings || settings.status !== "open") {
      return res.status(403).send({ message: "Voting sedang ditutup." });
    }

    // Cek apakah kandidat ada
    const kandidat = await Kandidat.findById(kandidatId);
    if (!kandidat) {
      return res.status(404).send({ message: "Kandidat tidak ditemukan." });
    }

    // Cek apakah user sudah pernah vote
    const existingVote = await Vote.findOne({ user: userId });
    if (existingVote) {
      return res.status(400).send({ message: "Anda sudah melakukan voting." });
    }

    // Simpan vote
    const vote = new Vote({ user: userId, kandidat: kandidatId });
    await vote.save();

    // Update status user menjadi "Sudah Memilih"
    await User.findByIdAndUpdate(userId, { status: "Sudah Memilih" });

    res.status(200).send({ message: "Vote berhasil disimpan!" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error menyimpan vote." });
  }
};

// GET /api/hasil - Get voting results (admin only)
exports.getHasil = async (req, res) => {
  try {
    const kandidatList = await Kandidat.find({});

    const hasil = await Promise.all(
      kandidatList.map(async (kandidat) => {
        const jumlahVote = await Vote.countDocuments({ kandidat: kandidat._id });
        return {
          _id: kandidat._id,
          nourut: kandidat.nourut,
          nama: kandidat.nama,
          foto: kandidat.foto,
          visi: kandidat.visi,
          misi: kandidat.misi,
          jumlahVote
        };
      })
    );

    // Urutkan dari perolehan suara terbanyak
    hasil.sort((a, b) => b.jumlahVote - a.jumlahVote);

    const totalVote = hasil.reduce((sum, k) => sum + k.jumlahVote, 0);

    res.status(200).send({ data: hasil, totalVote });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error mengambil hasil voting." });
  }
};

// GET /api/vote/status - Cek apakah user sudah vote
exports.getVoteStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const vote = await Vote.findOne({ user: userId }).populate("kandidat", "nourut nama");

    if (vote) {
      res.status(200).send({ sudahMemilih: true, kandidat: vote.kandidat });
    } else {
      res.status(200).send({ sudahMemilih: false });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Error mengambil status vote." });
  }
};
