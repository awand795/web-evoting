import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Timer, AlertTriangle } from "lucide-react";

export default function CountdownTimer({ waktuMulai, waktuSelesai, status, onStatusChange }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [phase, setPhase] = useState("loading"); // 'before' | 'during' | 'after' | 'closed'

  const calculateTimeLeft = useCallback(() => {
    if (status === "closed") {
      setPhase("closed");
      setTimeLeft(null);
      return;
    }

    const now = new Date();
    const start = waktuMulai ? new Date(waktuMulai) : null;
    const end = waktuSelesai ? new Date(waktuSelesai) : null;

    if (!start && !end) {
      // No schedule set, use status
      setPhase(status === "open" ? "during" : "closed");
      setTimeLeft(null);
      return;
    }

    if (start && now < start) {
      // Before voting starts
      const diff = start - now;
      setPhase("before");
      setTimeLeft(diff);
      return;
    }

    if (end && now > end) {
      // After voting ended
      setPhase("after");
      setTimeLeft(null);
      if (status === "open" && onStatusChange) {
        // Signal that voting should be closed
        onStatusChange("closed");
      }
      return;
    }

    // During voting
    if (end) {
      const diff = end - now;
      setPhase("during");
      setTimeLeft(diff);
    } else {
      setPhase("during");
      setTimeLeft(null);
    }
  }, [waktuMulai, waktuSelesai, status, onStatusChange]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  function formatTime(ms) {
    if (ms <= 0) return null;
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  const time = timeLeft != null ? formatTime(timeLeft) : null;

  if (phase === "loading" || (!waktuMulai && !waktuSelesai && status !== "closed")) {
    return null;
  }

  const getTimerDisplay = () => {
    switch (phase) {
      case "before":
        return {
          icon: Clock,
          title: "Voting Dimulai Dalam",
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "during":
        return {
          icon: Timer,
          title: "Voting Berakhir Dalam",
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
        };
      case "after":
        return {
          icon: AlertTriangle,
          title: "Voting Telah Berakhir",
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
        };
      case "closed":
        return {
          icon: Clock,
          title: "Voting Ditutup",
          color: "text-gray-500 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-gray-800",
          border: "border-gray-200 dark:border-gray-700",
        };
      default:
        return null;
    }
  };

  const display = getTimerDisplay();
  if (!display) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${display.border} ${display.bg} p-4 mb-6 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-1.5 rounded-lg ${display.bg}`}>
          <display.icon className={`w-5 h-5 ${display.color}`} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${display.color}`}>{display.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {phase === "before" && waktuMulai && `Mulai: ${new Date(waktuMulai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}
            {phase === "during" && waktuSelesai && `Berakhir: ${new Date(waktuSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {time && (phase === "before" || phase === "during") ? (
          <motion.div
            key={`${phase}-${time.days}-${time.hours}-${time.minutes}-${time.seconds}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {time.days > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {String(time.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Hari</span>
              </div>
            )}
            {time.days > 0 && <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-4">:</span>}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {String(time.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Jam</span>
            </div>
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {String(time.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Menit</span>
            </div>
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {String(time.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">Detik</span>
            </div>
          </motion.div>
        ) : phase === "after" || phase === "closed" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {phase === "after"
              ? "Sesi voting telah berakhir. Terima kasih atas partisipasinya!"
              : "Sesi voting sedang ditutup oleh administrator."}
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {phase === "during" ? "Voting sedang berlangsung." : "Menunggu jadwal voting..."}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
