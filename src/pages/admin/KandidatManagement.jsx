import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllKandidat, createKandidat, updateKandidat, deleteKandidat } from "../../services/kandidat.service";
import { Plus, Search, Edit3, Trash2, Save, X, Check, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { TableSkeleton } from "../../components/Skeleton";

const emptyForm = { nourut: "", nama: "", visi: "", misi: "" };

export default function KandidatManagement() {
  const [kandidat, setKandidat] = useState([]);
  const [filteredKandidat, setFilteredKandidat] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadKandidat() {
    try {
      const res = await getAllKandidat();
      setKandidat(res.data || []);
      setFilteredKandidat(res.data || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => { loadKandidat(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredKandidat(
      kandidat.filter((k) =>
        k.nama.toLowerCase().includes(q) ||
        k.nourut.toString().includes(q)
      )
    );
  }, [search, kandidat]);

  function clearMessages() { setError(""); }

  async function handleCreate(e) {
    e.preventDefault();
    clearMessages();
    try {
      await createKandidat(form);
      toast.success("Kandidat berhasil ditambahkan");
      setForm(emptyForm);
      loadKandidat();
    } catch (err) { setError(err.message); }
  }

  function startEdit(k) {
    setEditingId(k._id);
    setEditForm({ nourut: k.nourut, nama: k.nama, visi: k.visi, misi: k.misi });
  }

  function cancelEdit() { setEditingId(null); setEditForm({}); }

  async function handleUpdate(id) {
    clearMessages();
    try {
      await updateKandidat(id, editForm);
      toast.success("Kandidat berhasil diperbarui");
      setEditingId(null);
      loadKandidat();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus kandidat ini?")) return;
    clearMessages();
    try {
      await deleteKandidat(id);
      toast.success("Kandidat berhasil dihapus");
      loadKandidat();
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Kandidat</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Tambah, edit, dan hapus kandidat pemilu</p>
      </motion.div>

      {error && <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>}

      {/* Add form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Tambah Kandidat Baru
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">No. Urut</label>
            <input value={form.nourut} onChange={(e) => setForm({ ...form, nourut: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nama</label>
            <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Visi</label>
            <textarea value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} required rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Misi</label>
            <textarea value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })} required rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none" />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button type="submit" className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Kandidat
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kandidat..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      {/* Table */}
      {loading ? <TableSkeleton rows={4} cols={5} /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">No. Urut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Visi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Misi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredKandidat.map((k) => (
                  <tr key={k._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${editingId === k._id ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
                    {editingId === k._id ? (
                      <>
                        {["nourut", "nama", "visi", "misi"].map((field) => (
                          <td key={field} className="px-4 py-2">
                            <input value={editForm[field]}
                              onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                              className="w-full px-2 py-1.5 rounded-lg border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <div className="flex gap-1.5">
                            <button onClick={() => handleUpdate(k._id)} className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"><Save className="w-4 h-4" /></button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs">#{k.nourut}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{k.nama}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{k.visi}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{k.misi}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => startEdit(k)} className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(k._id)} className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredKandidat.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Tidak ada kandidat ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
