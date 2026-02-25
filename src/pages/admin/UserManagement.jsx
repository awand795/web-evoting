import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/user.service";
import "./UserManagement.css";

const emptyForm = { name: "", username: "", email: "", password: "", roles: ["user"] };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleCreate(e) {
    e.preventDefault();
    clearMessages();
    try {
      await createUser(form);
      setSuccess("Pengguna berhasil ditambahkan");
      setForm(emptyForm);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(user) {
    setEditingId(user._id);
    setEditForm({
      name: user.name,
      username: user.username,
      email: user.email,
    });
    clearMessages();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function handleUpdate(id) {
    clearMessages();
    try {
      await updateUser(id, editForm);
      setSuccess("Pengguna berhasil diperbarui");
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;
    clearMessages();
    try {
      await deleteUser(id);
      setSuccess("Pengguna berhasil dihapus");
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-container user-management">
      <h1 className="page-title">Kelola Pengguna</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-inline" onSubmit={handleCreate}>
        <div className="form-group">
          <label>Nama</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={form.roles[0]}
            onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-primary">Tambah</button>
      </form>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className={editingId === u._id ? "edit-row" : ""}>
                  {editingId === u._id ? (
                    <>
                      <td>
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({ ...editForm, username: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </td>
                      <td>{u.status || "-"}</td>
                      <td className="actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdate(u._id)}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={cancelEdit}
                        >
                          Batal
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.status || "-"}</td>
                      <td className="actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => startEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-light)" }}>
                    Belum ada pengguna
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
