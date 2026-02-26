# E-Voting Backend

REST API untuk sistem pemilihan elektronik (e-voting) berbasis Node.js, Express, dan MongoDB.

## Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Autentikasi**: JWT (JSON Web Token)
- **Enkripsi Password**: bcryptjs
- **Upload File**: Multer
- **Import Excel**: xlsx
- **Environment**: dotenv

## Struktur Direktori

```
app/
├── config/         # Konfigurasi database & auth
├── controllers/    # Logic handler setiap endpoint
├── middlewares/    # Auth JWT & role check
├── models/         # Schema Mongoose (User, Role, Kandidat, Vote, Settings)
└── routes/         # Definisi route API
server.js           # Entry point
```

## Instalasi

```bash
# Install dependensi
npm install

# Jalankan development (dengan nodemon)
npm run dev

# Jalankan production
npm start
```

## Konfigurasi

Buat file `.env` di root project:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/evoting
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/signup` | Registrasi akun baru |
| POST | `/api/auth/signin` | Login, mendapat JWT token |

### Kandidat
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/kandidat` | Ambil semua kandidat | ✅ |
| POST | `/api/kandidat` | Tambah kandidat | Admin |
| PUT | `/api/kandidat/:id` | Edit kandidat | Admin |
| DELETE | `/api/kandidat/:id` | Hapus kandidat | Admin |
| GET | `/api/kandidat/template` | Unduh template Excel | Admin |
| POST | `/api/kandidat/import-excel` | Import kandidat dari Excel | Admin |
| POST | `/api/kandidat/:id/foto` | Upload foto kandidat | Admin |
| POST | `/api/kandidat/:id/video` | Upload video visi misi | Admin |

### Voting
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/vote` | Kirim suara | User (bukan Admin) |
| GET | `/api/vote/status` | Cek status sudah memilih | ✅ |
| GET | `/api/hasil` | Hasil voting | ✅ |
| GET | `/api/public/hasil` | Hasil voting publik | ❌ (tanpa login) |

### Pengguna (Admin)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/users` | Ambil semua pengguna | Admin |
| PUT | `/api/users/:id` | Edit pengguna (termasuk password) | Admin |
| DELETE | `/api/users/:id` | Hapus pengguna | Admin |

### Pengaturan (Admin)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/settings` | Ambil status voting | ✅ |
| POST/PUT | `/api/settings` | Buka/tutup voting | Admin |

## Aturan Bisnis

- **Admin tidak dapat memilih** — endpoint `POST /api/vote` menolak request dari user ber-role admin
- **Vote admin tidak dihitung** — endpoint hasil voting mengecualikan vote dari user admin
- **Satu orang satu suara** — sistem mencegah user memilih lebih dari satu kali
- **Voting bisa dibuka/ditutup** — admin dapat mengatur status voting melalui Settings

## File Upload

File foto dan video kandidat disimpan di:
```
resources/static/assets/uploads/
```

Dapat diakses via URL: `http://localhost:5000/resources/static/assets/uploads/<filename>`
