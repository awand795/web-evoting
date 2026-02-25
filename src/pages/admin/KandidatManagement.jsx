import { useEffect, useState } from "react";
import {
  getAllKandidat,
  createKandidat,
  updateKandidat,
  deleteKandidat,
} from "../../services/kandidat.service";
import "./KandidatManagement.css";

const emptyForm = { nourut: "", nama: "", visi: "", misi: "" };

export default function KandidatManagement() {
  const [kandidat, setKandidat] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadKandidat() {
    try {
      const res = await getAllKandidat();
      setKandidat(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadKandidat();
  }, []);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleCreate(e) {
    e.preventDefault();
    clearMessages();
    try {
      await createKandidat(form);
      setSuccess("Kandidat berhasil ditambahkan");
      setForm(emptyForm);
      loadKandidat();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(k) {
    setEditingId(k._id);
    setEditForm({
      nourut: k.nourut,
      nama: k.nama,
      visi: k.visi,
      misi: k.misi,
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
      await updateKandidat(id, editForm);
      setSuccess("Kandidat berhasil diperbarui");
      setEditingId(null);
      loadKandidat();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus kandidat ini?")) return;
    clearMessages();
    try {
      await deleteKandidat(id);
      setSuccess("Kandidat berhasil dihapus");
      loadKandidat();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-container kandidat-management">
      <h1 className="page-title">Kelola Kandidat</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form-inline" onSubmit={handleCreate}>
        <div className="form-group">
          <label>No. Urut</label>
          <input
            value={form.nourut}
            onChange={(e) => setForm({ ...form, nourut: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Nama</label>
          <input
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Visi</label>
          <textarea
            value={form.visi}
            onChange={(e) => setForm({ ...form, visi: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Misi</label>
          <textarea
            value={form.misi}
            onChange={(e) => setForm({ ...form, misi: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary">Tambah</button>
      </form>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No. Urut</th>
                <th>Nama</th>
                <th>Visi</th>
                <th>Misi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kandidat.map((k) => (
                <tr key={k._id} className={editingId === k._id ? "edit-row" : ""}>
                  {editingId === k._id ? (
                    <>
                      <td>
                        <input
                          value={editForm.nourut}
                          onChange={(e) =>
                            setEditForm({ ...editForm, nourut: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editForm.nama}
                          onChange={(e) =>
                            setEditForm({ ...editForm, nama: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          value={editForm.visi}
                          onChange={(e) =>
                            setEditForm({ ...editForm, visi: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          value={editForm.misi}
                          onChange={(e) =>
                            setEditForm({ ...editForm, misi: e.target.value })
                          }
                        />
                      </td>
                      <td className="actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdate(k._id)}
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
                      <td>{k.nourut}</td>
                      <td>{k.nama}</td>
                      <td><div className="visi-misi">{k.visi}</div></td>
                      <td><div className="visi-misi">{k.misi}</div></td>
                      <td className="actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => startEdit(k)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(k._id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {kandidat.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-light)" }}>
                    Belum ada kandidat
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
