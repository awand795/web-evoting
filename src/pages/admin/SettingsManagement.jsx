import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../services/settings.service";
import "./SettingsManagement.css";

export default function SettingsManagement() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSettings() {
    try {
      const res = await getSettings();
      const data = res.data;
      setSettings(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function toggleStatus() {
    if (!settings) return;
    setError("");
    setSuccess("");
    setLoading(true);

    const newStatus = settings.status === "open" ? "closed" : "open";
    try {
      await updateSettings(settings._id, { status: newStatus });
      setSettings({ ...settings, status: newStatus });
      setSuccess(
        newStatus === "open"
          ? "Voting berhasil dibuka"
          : "Voting berhasil ditutup"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isOpen = settings?.status === "open";

  return (
    <div className="page-container">
      <h1 className="page-title">Pengaturan Voting</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {settings ? (
        <div className="card settings-card">
          <h3 style={{ marginTop: 0 }}>Status Voting</h3>
          <div className="settings-status">
            <span className={`badge ${isOpen ? "badge-open" : "badge-closed"}`}>
              {isOpen ? "DIBUKA" : "DITUTUP"}
            </span>
          </div>
          <button
            className={`btn ${isOpen ? "btn-danger" : "btn-success"}`}
            onClick={toggleStatus}
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : isOpen
              ? "Tutup Voting"
              : "Buka Voting"}
          </button>
          <p className="settings-info">
            {isOpen
              ? "Voting sedang berlangsung. Pengguna dapat memilih kandidat."
              : "Voting ditutup. Pengguna tidak dapat memilih kandidat."}
          </p>
        </div>
      ) : (
        <p>Memuat pengaturan...</p>
      )}
    </div>
  );
}
