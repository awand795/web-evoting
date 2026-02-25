import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllKandidat } from "../services/kandidat.service";
import { getAllUsers } from "../services/user.service";
import { getVoteStatus } from "../services/vote.service";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ kandidat: 0, users: 0 });
  const [sudahMemilih, setSudahMemilih] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [kandidatRes, voteStatusRes] = await Promise.all([
          getAllKandidat(),
          getVoteStatus(),
        ]);
        setStats((prev) => ({ ...prev, kandidat: kandidatRes.data?.length || 0 }));
        setSudahMemilih(voteStatusRes.sudahMemilih || false);
      } catch {
        // ignore
      }

      if (isAdmin) {
        try {
          const usersRes = await getAllUsers();
          setStats((prev) => ({ ...prev, users: usersRes.data?.length || 0 }));
        } catch {
          // ignore
        }
      }
    }
    loadStats();
  }, [isAdmin]);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Selamat Datang, {user.name || user.username}!</h1>
        <p>
          Role: {user.roles?.map((r) => r.replace("ROLE_", "")).join(", ")}
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Jumlah Kandidat</h3>
          <div className="stat-value">{stats.kandidat}</div>
        </div>
        {isAdmin && (
          <div className="stat-card">
            <h3>Jumlah Pengguna</h3>
            <div className="stat-value">{stats.users}</div>
          </div>
        )}
        <div className="stat-card">
          <h3>Status Voting Anda</h3>
          <div className="stat-value" style={{ fontSize: "1.2rem" }}>
            {sudahMemilih === null ? "..." : sudahMemilih ? "Sudah Memilih" : "Belum Memilih"}
          </div>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/kandidat" className="dashboard-link-card">
          <h3>Lihat Kandidat</h3>
          <p>Lihat daftar kandidat dan visi misi mereka</p>
        </Link>
        <Link to="/hasil" className="dashboard-link-card">
          <h3>Hasil Voting</h3>
          <p>Lihat perolehan suara setiap kandidat</p>
        </Link>
        {isAdmin && (
          <>
            <Link to="/admin/users" className="dashboard-link-card">
              <h3>Kelola Pengguna</h3>
              <p>Tambah, edit, dan hapus pengguna</p>
            </Link>
            <Link to="/admin/kandidat" className="dashboard-link-card">
              <h3>Kelola Kandidat</h3>
              <p>Tambah, edit, dan hapus kandidat</p>
            </Link>
            <Link to="/admin/settings" className="dashboard-link-card">
              <h3>Pengaturan</h3>
              <p>Buka atau tutup sesi voting</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
