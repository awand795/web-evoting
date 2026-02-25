import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (!user) return null;

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        E-Voting
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/kandidat">Kandidat</NavLink>
        <NavLink to="/hasil">Hasil</NavLink>
        {isAdmin && <NavLink to="/admin/users">Pengguna</NavLink>}
        {isAdmin && <NavLink to="/admin/kandidat">Kelola Kandidat</NavLink>}
        {isAdmin && <NavLink to="/admin/settings">Pengaturan</NavLink>}
      </div>

      <div className="navbar-user">
        <span>{user.name || user.username}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Keluar
        </button>
      </div>
    </nav>
  );
}
