import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSettings, updateSettings } from "../../services/settings.service";
import { Settings, Lock, Unlock, RefreshCw, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsManagement() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initLoading, setInitLoading] = useState(true);

  async function loadSettings() {
    try {
      const res = await getSettings();
      const data = res.data;
      setSettings(Array.isArray(data) ? data[0] : data);
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
      await updateSettings(settings._id, { status: newStatus });
      setSettings({ ...settings, status: newStatus });
      toast.success(newStatus === "open" ? "Voting berhasil dibuka!" : "Voting berhasil ditutup!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
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
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Gagal memuat pengaturan</p>
      )}
    </div>
  );
}
