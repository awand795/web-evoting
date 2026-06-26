import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllKandidat } from "../../services/kandidat.service";
import { castVote, getVoteStatus } from "../../services/vote.service";
import { getSettings } from "../../services/settings.service";
import { useAuth } from "../../context/AuthContext";
import { Vote, X, CheckCircle, AlertCircle, Clock, User, Award } from "lucide-react";
import { CardSkeleton } from "../../components/Skeleton";
import toast from "react-hot-toast";

export default function KandidatList() {
  const [kandidat, setKandidat] = useState([]);
  const [sudahMemilih, setSudahMemilih] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const [selectedKandidat, setSelectedKandidat] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  function openConfirmModal(k) {
    setSelectedKandidat(k);
    setShowConfirmModal(true);
  }

  async function handleVote() {
    if (!selectedKandidat) return;
    setVoting(true);
    try {
      await castVote(selectedKandidat._id);
      setSudahMemilih(true);
      updateUserStatus("Sudah Memilih");
      toast.success("Suara Anda berhasil disimpan! Terima kasih.");
      setShowConfirmModal(false);
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan suara");
    } finally {
      setVoting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daftar Kandidat</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Daftar Kandidat</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pilih kandidat yang Anda percayai untuk memimpin</p>
      </motion.div>

      {/* Alerts */}
      {!votingOpen && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">Sesi voting sedang ditutup. Silakan hubungi administrator.</p>
        </motion.div>
      )}

      {sudahMemilih && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-5 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">Anda sudah memilih. Terima kasih atas partisipasinya!</p>
        </motion.div>
      )}

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Candidate Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
      >
        {kandidat.map((k, index) => (
          <motion.div
            key={k._id}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/10 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
          >
            {/* Photo / Number */}
            <div className="relative h-44 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
              {k.foto ? (
                <img
                  src={`http://localhost:5000/resources/static/assets/uploads/${k.foto}`}
                  alt={k.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="text-center">
                  <User className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                  <div className="mt-2 text-4xl font-bold text-blue-200 dark:text-blue-800">{k.nourut}</div>
                </div>
              )}
              {/* Number badge */}
              <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center font-bold text-sm text-blue-600 dark:text-blue-400 shadow-sm">
                #{k.nourut}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{k.nama}</h3>

              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Visi</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{k.visi}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Misi</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{k.misi}</p>
                </div>
              </div>

              <button
                onClick={() => openConfirmModal(k)}
                disabled={sudahMemilih || !votingOpen || voting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {sudahMemilih ? (
                  <>Sudah Memilih</>
                ) : !votingOpen ? (
                  <>Voting Ditutup</>
                ) : (
                  <><Vote className="w-4 h-4" />Pilih</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {kandidat.length === 0 && !error && (
        <div className="text-center py-16">
          <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada kandidat terdaftar</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedKandidat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Konfirmasi Pilihan</h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                    #{selectedKandidat.nourut}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedKandidat.nama}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nomor Urut {selectedKandidat.nourut}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-1">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Visi</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{selectedKandidat.visi}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Misi</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{selectedKandidat.misi}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Pilihan tidak dapat diubah setelah dikonfirmasi. Yakin ingin memilih kandidat ini?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleVote}
                  disabled={voting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {voting ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memproses...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" />Konfirmasi</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
