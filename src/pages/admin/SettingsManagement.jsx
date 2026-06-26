import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSettings, updateSettings } from "../../services/settings.service";
import { Settings, Lock, Unlock, RefreshCw, Clock, AlertCircle, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsManagement() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [initLoading, setInitLoading] = useState(true);
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");

  function toLocalDatetimeString(isoStr) {
    if (!isoStr) return "";
    // Format ISO ke datetime-local: "2024-01-01T00:00:00" -> "2024-01-01T00:00"
    return isoStr.substring(0, 16);
  }

  async function loadSettings() {
    try {
      const res = await getSettings();
      const data = res.data;
      const s = Array.isArray(data) ? data[0] : data;
      setSettings(s);
      setWaktuMulai(toLocalDatetimeString(s.waktuMulai));
      setWaktuSelesai(toLocalDatetimeString(s.waktuSelesai));
    } catch (err) {
      setError(err.message);
    }
    setInitLoading(false);
  }

  useEffect(() => { loadSettings(); }, []);

  async function toggleStatus() {
    if (!settings) return;
    setError("");
    setLoading(true);
    const newStatus = settings.status === "open" ? "closed" : "open";
    try {
      await updateSettings(settings.id, { status: newStatus });
      setSettings({ ...settings, status: newStatus });
      toast.success(newStatus === "open" ? "Voting berhasil dibuka!" : "Voting berhasil ditutup!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSchedule() {
    if (!settings) return;
    if (waktuSelesai && waktuMulai && new Date(waktuSelesai) <= new Date(waktuMulai)) {
      toast.error("Waktu selesai harus setelah waktu mulai");
      return;
    }
    setError("");
    setSaveLoading(true);
    try {
      // Kirim dalam format ISO dengan append ":00" untuk detik
      const data = {
        waktuMulai: waktuMulai ? waktuMulai + ":00" : null,
        waktuSelesai: waktuSelesai ? waktuSelesai + ":00" : null,
      };
      await updateSettings(settings.id, data);
      setSettings({ ...settings, ...data });
      toast.success("Jadwal voting berhasil disimpan!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaveLoading(false);
    }
  }

  const isOpen = settings?.status === "open";

  if (initLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Voting</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Atur sesi pemungutan suara</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </motion.div>
      )}

      {settings ? (
        <>
          {/* Schedule Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mb-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Atur Jadwal Voting</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={waktuMulai}
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    value={waktuSelesai}
                    onChange={(e) => setWaktuSelesai(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <button
                  onClick={saveSchedule}
                  disabled={saveLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {saveLoading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Calendar className="w-4 h-4" /> Simpan Jadwal</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg"
          >
            <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 sm:p-8 shadow-sm transition-all duration-300 ${
              isOpen ? "border-green-300 dark:border-green-700" : "border-red-300 dark:border-red-700"
            }`}>
              {/* Status indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isOpen ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                    {isOpen ? <Unlock className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status Voting</p>
                    <p className={`text-lg font-bold ${isOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {isOpen ? "DIBUKA" : "DITUTUP"}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isOpen
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}>
                  {isOpen ? "AKTIF" : "NONAKTIF"}
                </span>
              </div>

              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {isOpen
                        ? "Voting sedang berlangsung. Pengguna dapat memilih kandidat."
                        : "Voting ditutup. Pengguna tidak dapat memilih kandidat."}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isOpen
                        ? "Klik tombol di bawah untuk menutup sesi voting."
                        : "Klik tombol di bawah untuk membuka sesi voting."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={toggleStatus}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2 ${
                  isOpen
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                }`}
              >
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</>
                ) : isOpen ? (
                  <><Lock className="w-4 h-4" /> Tutup Voting</>
                ) : (
                  <><Unlock className="w-4 h-4" /> Buka Voting</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Gagal memuat pengaturan</p>
      )}
    </div>
  );
}
