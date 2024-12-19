-- migrations.sql

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT NULL
);

-- Create laporan_masuk table
CREATE TABLE IF NOT EXISTS laporan_masuk (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    jenis_infrastruktur VARCHAR(100) NOT NULL,
    tanggal_kejadian TIMESTAMP NOT NULL,
    deskripsi TEXT NOT NULL,
    alamat TEXT NOT NULL,
    bukti_lampiran TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude NUMERIC,
    longitude NUMERIC
);

-- Create riwayat_laporan table
CREATE TABLE IF NOT EXISTS riwayat_laporan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    jenis_infrastruktur VARCHAR(100) NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_kejadian TIMESTAMP NOT NULL,
    tanggal_selesai TIMESTAMP NOT NULL,
    alamat TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('diterima', 'ditolak')),
    keterangan_laporan TEXT NOT NULL,
    bukti_lampiran TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude NUMERIC,
    longitude NUMERIC
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    laporan_id INTEGER NOT NULL REFERENCES laporan_masuk(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);