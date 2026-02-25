import { useEffect, useState } from "react";
import { getHasil } from "../services/vote.service";
import "./HasilVoting.css";

export default function HasilVoting() {
  const [hasil, setHasil] = useState([]);
  const [totalVote, setTotalVote] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getHasil();
        setHasil(res.data || []);
        setTotalVote(res.totalVote || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ textAlign: "center", color: "var(--text-light)" }}>Memuat hasil...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Hasil Voting</h1>
      <p className="hasil-total">Total suara masuk: <strong>{totalVote}</strong></p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="hasil-list">
        {hasil.map((k, index) => {
          const persen = totalVote > 0 ? ((k.jumlahVote / totalVote) * 100).toFixed(1) : 0;
          return (
            <div key={k._id} className={`hasil-card ${index === 0 && totalVote > 0 ? "hasil-winner" : ""}`}>
              <div className="hasil-rank">#{index + 1}</div>
              <div className="hasil-info">
                <div className="hasil-nourut-nama">
                  <span className="nourut-badge">{k.nourut}</span>
                  <h3>{k.nama}</h3>
                  {index === 0 && totalVote > 0 && <span className="winner-badge">Unggul</span>}
                </div>
                <div className="hasil-bar-wrap">
                  <div className="hasil-bar" style={{ width: `${persen}%` }} />
                </div>
                <div className="hasil-angka">
                  <span>{k.jumlahVote} suara</span>
                  <span>{persen}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasil.length === 0 && !error && (
        <p style={{ textAlign: "center", color: "var(--text-light)" }}>
          Belum ada suara masuk
        </p>
      )}
    </div>
  );
}
