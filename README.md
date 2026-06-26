# 🗳️ Web E-Voting System

Sistem pemilihan elektronik (e-voting) berbasis web dengan dua branch utama:

| Branch | Stack | Deskripsi |
|--------|-------|-----------|
| **`backend`** | Spring Boot 3.4 + PostgreSQL | REST API backend |
| **`frontend`** | React 19 + Vite + Tailwind CSS v4 | Frontend SPA |

---

## 📦 Backend (`backend` branch)

### 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Runtime** | Java 21 (OpenJDK) |
| **Framework** | Spring Boot 3.4.4 |
| **Build Tool** | Maven 3.9.16 |
| **Database** | PostgreSQL |
| **ORM** | Spring Data JPA (Hibernate) |
| **Security** | Spring Security + JWT (JJWT 0.12) |
| **Validation** | Jakarta Validation |
| **Excel** | Apache POI 5.4 |
| **File Upload** | Spring MultipartFile |

### 📁 Struktur Project

```
src/main/java/com/wevoting/
├── WeVotingApplication.java
├── config/
│   ├── SecurityConfig.java       # Spring Security + JWT filter chain
│   ├── WebConfig.java            # Resource handler untuk foto
│   └── DatabaseInitializer.java  # Seed roles & settings awal
├── controller/
│   ├── AuthController.java       # Login/Register
│   ├── UserController.java       # CRUD user (admin)
│   ├── KandidatController.java   # CRUD kandidat + template Excel
│   ├── VoteController.java       # Voting + hasil
│   ├── SettingsController.java   # Buka/tutup voting
│   └── FileController.java       # Upload/download file
├── dto/
│   ├── LoginRequest.java
│   ├── SignupRequest.java
│   ├── VoteRequest.java
│   ├── JwtResponse.java
│   ├── MessageResponse.java
│   ├── KandidatResponse.java
│   ├── HasilResponse.java
│   └── UpdateUserRequest.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── model/
│   ├── User.java
│   ├── Role.java
│   ├── ERole.java
│   ├── Kandidat.java
│   ├── Vote.java
│   └── Settings.java
├── repository/                   # JPA Repositories
└── security/
    ├── AuthTokenFilter.java      # JWT filter
    ├── JwtUtils.java             # JWT generate/validate
    ├── UserDetailsImpl.java
    └── UserDetailsServiceImpl.java
```

### 🔧 Konfigurasi

Buat file `.env` atau set environment variable:

```env
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-ganti-di-production
PORT=5000
```

Atau edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/db_evoting
    username: postgres
    password: postgres

server:
  port: 5000
  servlet:
    context-path: /api
```

### 🚀 Menjalankan Backend

```bash
# Prasyarat: Java 21, PostgreSQL running, database db_evoting sudah dibuat

# Install Maven (jika belum)
# Download dari https://maven.apache.org/download.cgi

# Build & run
mvn spring-boot:run

# Atau build dulu lalu jalankan JAR
mvn clean package -DskipTests
java -jar target/we-voting-backend-1.0.0.jar
```

### 📋 API Endpoints

Semua endpoint diakses melalui `http://localhost:5000/api/...`

#### Auth
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/signup` | Registrasi akun baru | ❌ |
| POST | `/api/auth/signin` | Login, mendapat JWT token | ❌ |

#### Kandidat
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/kandidat` | Ambil semua kandidat | ❌ |
| GET | `/api/kandidat/{id}` | Detail kandidat | ❌ |
| POST | `/api/kandidat` | Tambah kandidat | Admin |
| PUT | `/api/kandidat/{id}` | Edit kandidat | Admin |
| DELETE | `/api/kandidat/{id}` | Hapus kandidat | Admin |
| GET | `/api/kandidat/template` | Template format import | ❌ |

#### Voting
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/vote` | Kirim suara | User (bukan Admin) |
| GET | `/api/vote/status` | Cek status sudah memilih | ✅ |
| GET | `/api/hasil` | Hasil voting (ranking) | ✅ |

#### User (Admin)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/user` | Ambil semua pengguna | Admin |
| GET | `/api/user/{id}` | Detail pengguna | ✅ |
| POST | `/api/user` | Tambah pengguna baru | Admin |
| PUT | `/api/user/{id}` | Edit pengguna / ganti password | ✅ |
| DELETE | `/api/user/{id}` | Hapus pengguna | Admin |

#### Settings (Admin)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/settings` | Ambil status voting | ✅ |
| PUT | `/api/settings/{id}` | Buka/tutup voting | Admin |

#### File Upload
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/files/upload` | Upload file | Admin |
| GET | `/api/files/{nama}` | Download file | ❌ |
| DELETE | `/api/files/{nama}` | Hapus file | Admin |

### 🗄️ Database

Backend menggunakan PostgreSQL dengan schema yang di-generate otomatis oleh Hibernate (`ddl-auto: update`).

**Tables:**
- `users` — Data pengguna
- `roles` — Role (USER, ADMIN, MODERATOR)
- `user_roles` — Relasi user ↔ role
- `kandidats` — Data kandidat
- `votes` — Suara (unique constraint on user_id)
- `settings` — Pengaturan voting (open/closed)

### 📸 File Upload

Foto & file kandidat disimpan di direktori `./uploads/` dan diakses via:
```
http://localhost:5000/api/resources/static/assets/uploads/{filename}
```

---

## 🎨 Frontend (`frontend` branch)

### 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Framework** | React 19 |
| **Bundler** | Vite 6 |
| **Routing** | React Router DOM 7 |
| **CSS** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Notifications** | React Hot Toast |

### 📁 Struktur Project

```
src/
├── components/
│   ├── Navbar.jsx          # Navigasi + dark mode toggle + mobile menu
│   ├── ProtectedRoute.jsx  # Route guard untuk user login
│   ├── AdminRoute.jsx      # Route guard untuk admin
│   ├── Skeleton.jsx        # Loading skeleton components
│   └── PageTransition.jsx  # Animasi transisi halaman
├── context/
│   └── AuthContext.jsx      # State management autentikasi
├── pages/
│   ├── LoginPage.jsx       # Halaman login
│   ├── RegisterPage.jsx    # Halaman register + password strength
│   ├── DashboardPage.jsx   # Dashboard dengan statistik
│   ├── HasilVoting.jsx     # Hasil voting dengan bar chart animasi
│   ├── ProfilePage.jsx     # Edit profil + ganti password
│   ├── user/
│   │   └── KandidatList.jsx # Daftar kandidat + vote + modal konfirmasi
│   └── admin/
│       ├── UserManagement.jsx      # CRUD user + search filter
│       ├── KandidatManagement.jsx  # CRUD kandidat + search filter
│       └── SettingsManagement.jsx  # Buka/tutup voting
├── services/
│   ├── api.jsx             # HTTP client (fetch wrapper)
│   ├── auth.service.jsx    # Auth API calls
│   ├── kandidat.service.jsx
│   ├── user.service.jsx
│   ├── vote.service.jsx
│   └── settings.service.jsx
├── index.css               # Tailwind CSS imports + custom theme
├── index.jsx               # Entry point + dark mode init
└── App.jsx                 # Routes + layout
```

### 🚀 Menjalankan Frontend

```bash
cd frontend  # atau checkout branch frontend
npm install
npm run dev     # Development server di http://localhost:3000
npm run build   # Build production ke folder dist/
```

### ✨ Fitur

#### User
- 🔐 Login/Register dengan validasi
- 📊 Dashboard dengan statistik real-time
- 👥 Lihat daftar kandidat + detail
- ✅ Vote dengan modal konfirmasi
- 🏆 Hasil voting dengan bar chart animasi
- 👤 Edit profil & ganti password

#### Admin
- 👥 Kelola pengguna (CRUD + search/filter)
- 🗳️ Kelola kandidat (CRUD + search/filter)
- ⚙️ Buka/tutup sesi voting
- 👀 Semua fitur user

#### Umum
- 🌙 **Dark mode** — toggle manual + deteksi sistem otomatis
- 📱 **Responsive** — mobile-friendly dengan navigation drawer
- 🎨 **Animasi** — transisi halaman halus + micro-interactions
- 🔔 **Toast notification** — notifikasi real-time
- ⌛ **Loading skeleton** — UX lebih baik saat loading
- 🔍 **Search/filter** — di tabel management admin

---

## 🐳 Deployment (Docker)

### Backend
```dockerfile
FROM eclipse-temurin:21-jre
COPY target/we-voting-backend-1.0.0.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 Lisensi

Project ini dikembangkan untuk tujuan pendidikan dan pembelajaran.
