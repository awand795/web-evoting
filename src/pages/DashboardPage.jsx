import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllKandidat } from "../services/kandidat.service";
import { getAllUsers } from "../services/user.service";
import { getVoteStatus, getHasil } from "../services/vote.service";
import { motion } from "framer-motion";
import { Vote, Users, BarChart3, CheckCircle, Clock, UserCheck, Settings, Shield, ArrowRight, User } from "lucide-react";
import { StatsSkeleton } from "../components/Skeleton";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ kandidat: 0, users: 0, totalVote: 0 });
  const [sudahMemilih, setSudahMemilih] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [kandidatRes, voteStatusRes, hasilRes] = await Promise.all([
          getAllKandidat(),
          getVoteStatus(),
          getHasil().catch(() => ({ data: [], totalVote: 0 })),
        ]);
        setStats((prev) => ({ ...prev, kandidat: kandidatRes.data?.length || 0, totalVote: hasilRes.totalVote || 0 }));
        setSudahMemilih(voteStatusRes.sudahMemilih || false);
      } catch { /* ignore */ }

      if (isAdmin) {
        try {
          const usersRes = await getAllUsers();
          setStats((prev) => ({ ...prev, users: usersRes.data?.length || 0 }));
        } catch { /* ignore */ }
      }
      setLoading(false);
    }
    loadStats();
  }, [isAdmin]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const statCards = [
    { icon: Vote, label: "Jumlah Kandidat", value: stats.kandidat, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: UserCheck, label: "Status Voting Anda", value: sudahMemilih === null ? "..." : sudahMemilih ? "Sudah Memilih" : "Belum Memilih", color: sudahMemilih ? "from-green-500 to-green-600" : "from-yellow-500 to-yellow-600", bg: sudahMemilih ? "bg-green-50 dark:bg-green-900/20" : "bg-yellow-50 dark:bg-yellow-900/20" },
    { icon: BarChart3, label: "Total Suara Masuk", value: stats.totalVote, color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  if (isAdmin) {
    statCards.splice(1, 0, { icon: Users, label: "Jumlah Pengguna", value: stats.users, color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" });
  }

  const quickLinks = [
    { to: "/kandidat", icon: Vote, title: "Lihat Kandidat", desc: "Lihat daftar kandidat dan visi misi mereka", color: "text-blue-600 dark:text-blue-400" },
    { to: "/hasil", icon: BarChart3, title: "Hasil Voting", desc: "Lihat perolehan suara setiap kandidat", color: "text-purple-600 dark:text-purple-400" },
    { to: "/profile", icon: User, title: "Profil Saya", desc: "Kelola informasi akun Anda", color: "text-green-600 dark:text-green-400" },
  ];

  const adminLinks = [
    { to: "/admin/users", icon: Users, title: "Kelola Pengguna", desc: "Tambah, edit, dan hapus pengguna", color: "text-indigo-600 dark:text-indigo-400" },
    { to: "/admin/kandidat", icon: Shield, title: "Kelola Kandidat", desc: "Tambah, edit, dan hapus kandidat", color: "text-orange-600 dark:text-orange-400" },
    { to: "/admin/settings", icon: Settings, title: "Pengaturan", desc: "Buka atau tutup sesi voting", color: "text-rose-600 dark:text-rose-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Selamat Datang, {user.name || user.username}!
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Role: {user.roles?.map((r) => r.replace("ROLE_", "")).join(", ")}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {isAdmin ? "Admin" : "Pemilih"}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={i} variants={item} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${card.color}`} />
              <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 group-hover:border-transparent dark:group-hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${card.bg}`}>
                    <card.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{card.label}</span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{card.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-200`}>
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Admin Links */}
        {isAdmin && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Administrasi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 group-hover:scale-110 transition-transform duration-200">
                      <link.icon className={`w-5 h-5 ${link.color}`} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{link.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
