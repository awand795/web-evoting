import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Moon, Sun, LogOut, User, LayoutDashboard, Users, BarChart3, Vote, Settings, Shield } from "lucide-react";

export default function Navbar() {
  const { user, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  if (!user) return null;

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-white/20 text-white shadow-sm"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/kandidat", label: "Kandidat", icon: Vote },
    { to: "/hasil", label: "Hasil", icon: BarChart3 },
  ];

  const adminLinks = [
    { to: "/admin/users", label: "Pengguna", icon: Users },
    { to: "/admin/kandidat", label: "Kelola Kandidat", icon: Shield },
    { to: "/admin/settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <NavLink to="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <Vote className="w-6 h-6" />
            <span>E-Voting</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/dashboard"}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/20">
                {adminLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass}>
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150"
              title={darkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User info desktop */}
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/profile" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {(user.name || user.username || "U")[0].toUpperCase()}
                </div>
                <span className="font-medium">{user.name || user.username}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-700 dark:bg-gray-800 border-t border-white/10 pb-3 animate-slideDown">
          <div className="px-4 pt-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={linkClass} end={link.to === "/dashboard"}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <>
                <div className="text-white/50 text-xs uppercase tracking-wider px-3 pt-2 pb-1">Admin</div>
                {adminLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={linkClass}>
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                ))}
              </>
            )}
            <div className="border-t border-white/10 pt-2 mt-2">
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={linkClass}>
                <User className="w-4 h-4" />
                Profil
              </NavLink>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all">
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
