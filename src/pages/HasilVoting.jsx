import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHasil } from "../services/vote.service";
import { BarChart3, Trophy, TrendingUp, Award } from "lucide-react";
import { CardSkeleton } from "../components/Skeleton";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hasil Voting</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const maxVote = hasil.length > 0 ? Math.max(...hasil.map((k) => k.jumlahVote)) : 0;
  const partisipasi = totalVote > 0 ? "Ada" : "Belum ada";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Hasil Voting</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Perolehan suara terkini</p>
      </motion.div>

      {/* Total votes card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-xl p-6 mb-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Suara Masuk</p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">{totalVote}</p>
            <p className="text-blue-200 text-sm mt-1">Partisipasi: {partisipasi}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results list */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-3"
      >
        {hasil.map((k, index) => {
          const persen = totalVote > 0 ? ((k.jumlahVote / totalVote) * 100).toFixed(1) : 0;
          const barPercent = maxVote > 0 ? (k.jumlahVote / maxVote) * 100 : 0;
          const isWinner = index === 0 && totalVote > 0;

          return (
            <motion.div
              key={k._id}
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
              className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                isWinner
                  ? "border-yellow-400 dark:border-yellow-500 shadow-lg shadow-yellow-100 dark:shadow-yellow-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isWinner ? "bg-yellow-400 text-yellow-900" : index === 1 ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : index === 2 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        #{k.nourut}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{k.nama}</h3>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold shadow-sm">
                          <Trophy className="w-3 h-3" /> Unggul
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5 relative">
                      <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barPercent}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isWinner
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                              : "bg-gradient-to-r from-blue-500 to-blue-600"
                          }`}
                          style={{ minWidth: barPercent > 0 ? "4px" : "0" }}
                        />
                      </div>
                    </div>

                    {/* Numbers */}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {k.jumlahVote} suara
                      </span>
                      <span className={`text-sm font-bold ${isWinner ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {persen}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {hasil.length === 0 && !error && (
        <div className="text-center py-16">
          <Award className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Belum ada suara masuk</p>
        </div>
      )}
    </div>
  );
}
