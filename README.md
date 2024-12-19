# 🌆 UrbanAID

> 🏧 Platform pelaporan dan sosialisasi infrastruktur modern

UrbanAID adalah aplikasi web yang memungkinkan pengguna untuk melaporkan masalah infrastruktur dan mengakses konten edukasi tentang infrastruktur perkotaan.

## ✨ Fitur Utama

### 👤 Fitur Pengguna
- 🔐 Otentikasi pengguna (login/registrasi)
- 🖍️ Sistem pelaporan infrastruktur
- 🔍 Pelacakan laporan aktif
- 📊 Riwayat laporan
- 👤 Profil pengguna
- 📚 Artikel edukasi
- 🎓 Sumber belajar tentang infrastruktur

### 👨‍💼 Fitur Admin
- 📢 Mengelola laporan masuk
- ✅ Menangani ulasan laporan
- 👥 Manajemen pengguna
- 🔑 Manajemen admin (super admin)
- 📊 Dashboard statistik

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚡ JavaScript (Vanilla)
- 💅 Tailwind CSS
- 📦 Webpack
- 📱 PWA Support
- 🧪 Jest for testing

### ⚙️ Backend
- 🔷 Node.js
- 🚀 Hapi.js
- 🐘 PostgreSQL
- 🔒 JWT Authentication
- 🧪 Jest for testing

## 📚 API Documentation
📖 [API Documentation](https://urbanaid-api.vercel.app/)

## ✨ Setup Instructions

### 🎨 Frontend Setup

1. Masuk ke direktori client:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run start-dev
```

4. Build untuk production:
```bash
npm run build
```

### ⚙️ Backend Setup

1. Masuk ke direktori server:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Buat database dan jalankan migrations:
```bash
# Buat database PostgreSQL Anda dan update file .env
npm run migrate
```

5. Buat super admin (opsional):
```bash
npm run create-superadmin
```

6. Jalankan development server:
```bash
npm run dev
```

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## 🖍️ Catatan Tambahan
- Pastikan PostgreSQL sudah terinstal di sistem Anda.
- Gunakan Postman atau aplikasi serupa untuk menguji API secara manual.
- Untuk menjalankan production server, sesuaikan konfigurasi environment sesuai kebutuhan.

## 📝 License
ISC License

