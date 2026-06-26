import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../services/user.service";
import { Plus, Search, Edit3, Trash2, Save, X, Users } from "lucide-react";
import toast from "react-hot-toast";
import { TableSkeleton } from "../../components/Skeleton";

const emptyForm = { name: "", username: "", email: "", password: "", roles: ["user"] };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredUsers(users.filter((u) =>
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  function clearMessages() { setError(""); }

  async function handleCreate(e) {
    e.preventDefault();
    clearMessages();
    try {
      await createUser(form);
      toast.success("Pengguna berhasil ditambahkan");
      setForm(emptyForm);
      loadUsers();
    } catch (err) { setError(err.message); }
  }

  function startEdit(user) {
    setEditingId(user._id);
    setEditForm({ name: user.name, username: user.username, email: user.email });
  }

  function cancelEdit() { setEditingId(null); setEditForm({}); }

  async function handleUpdate(id) {
    clearMessages();
    try {
      await updateUser(id, editForm);
      toast.success("Pengguna berhasil diperbarui");
      setEditingId(null);
      loadUsers();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;
    clearMessages();
    try {
      await deleteUser(id);
      toast.success("Pengguna berhasil dihapus");
      loadUsers();
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Pengguna</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Tambah, edit, dan hapus pengguna sistem</p>
      </motion.div>

      {error && <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>}

      {/* Add form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600" /> Tambah Pengguna Baru
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nama</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Role</label>
            <select value={form.roles[0]} onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-5">
            <button type="submit" className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Pengguna
            </button>
          </div>
        </form>
      </motion.div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pengguna..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      </div>

      {/* Table */}
      {loading ? <TableSkeleton rows={4} cols={5} /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Username</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${editingId === u._id ? "bg-indigo-50 dark:bg-indigo-900/10" : ""}`}>
                    {editingId === u._id ? (
                      <>
                        {["name", "username", "email"].map((field) => (
                          <td key={field} className="px-4 py-2">
                            <input value={editForm[field]} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                              className="w-full px-2 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === "Sudah Memilih" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                            {u.status || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1.5">
                            <button onClick={() => handleUpdate(u._id)} className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"><Save className="w-4 h-4" /></button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.username}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.status === "Sudah Memilih"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}>
                            {u.status || "Belum"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Tidak ada pengguna ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
