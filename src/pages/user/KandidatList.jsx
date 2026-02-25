import { useEffect, useState } from "react";
import { getAllKandidat } from "../../services/kandidat.service";
import { castVote, getVoteStatus } from "../../services/vote.service";
import { getSettings } from "../../services/settings.service";
import { useAuth } from "../../context/AuthContext";
import "./KandidatList.css";

export default function KandidatList() {
  const [kandidat, setKandidat] = useState([]);
  const [sudahMemilih, setSudahMemilih] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { updateUserStatus } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const [kandidatRes, statusRes, settingsRes] = await Promise.all([
          getAllKandidat(),
          getVoteStatus(),
          getSettings(),
        ]);
        setKandidat(kandidatRes.data || []);
        setSudahMemilih(statusRes.sudahMemilih || false);
        // settings API returns array, get first item
        const settingsData = Array.isArray(settingsRes.data) ? settingsRes.data[0] : settingsRes.data;
        setVotingOpen(settingsData?.status === "open");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleVote(id) {
    if (!window.confirm("Yakin ingin memilih kandidat ini? Pilihan tidak dapat diubah.")) return;

    setVoting(true);
    setError("");
    try {
      await castVote(id);
      setSudahMemilih(true);
      updateUserStatus("Sudah Memilih");
      setSuccess("Terima kasih! Suara Anda berhasil disimpan.");
    } catch (err) {
      setError(err.message);
    } finally {
      setVoting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ textAlign: "center", color: "var(--text-light)" }}>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Daftar Kandidat</h1>

      {!votingOpen && (
        <div className="alert alert-error">
          Sesi voting sedang ditutup. Silakan hubungi administrator.
        </div>
      )}

      {sudahMemilih && (
        <div className="alert alert-success">
          {success || "Anda sudah memilih. Terima kasih atas partisipasinya!"}
        </div>
      )}

      {!sudahMemilih && success && (
        <div className="alert alert-success">{success}</div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="kandidat-grid">
        {kandidat.map((k) => (
          <div key={k._id} className="kandidat-card">
            <div className="nourut">{k.nourut}</div>
            {k.foto && (
              <img
                src={`http://localhost:8080/resources/static/assets/uploads/${k.foto}`}
                alt={k.nama}
                className="kandidat-foto"
              />
            )}
            <h3>{k.nama}</h3>
            <div className="section-label">Visi</div>
            <div className="section-text">{k.visi}</div>
            <div className="section-label">Misi</div>
            <div className="section-text">{k.misi}</div>
            <button
              className="btn btn-primary"
              onClick={() => handleVote(k._id)}
              disabled={sudahMemilih || !votingOpen || voting}
            >
              {sudahMemilih ? "Sudah Memilih" : voting ? "Menyimpan..." : "Pilih"}
            </button>
          </div>
        ))}
      </div>

      {kandidat.length === 0 && !error && (
        <p style={{ textAlign: "center", color: "var(--text-light)" }}>
          Belum ada kandidat terdaftar
        </p>
      )}
    </div>
  );
}
