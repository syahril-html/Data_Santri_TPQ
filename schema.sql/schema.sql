-- Tabel untuk menyimpan data utama santri
CREATE TABLE IF NOT EXISTS santri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    kelas TEXT,
    status_aktif INTEGER DEFAULT 1 -- 1 untuk Aktif, 0 untuk Non-Aktif
);

-- (Opsional) Tabel untuk mencatat riwayat absen
CREATE TABLE IF NOT EXISTS absensi (
    id_absen INTEGER PRIMARY KEY AUTOINCREMENT,
    id_santri INTEGER,
    tanggal TEXT DEFAULT (NULL), -- Format YYYY-MM-DD
    status TEXT, -- Hadir, Sakit, Izin, Alpa
    FOREIGN KEY (id_santri) REFERENCES santri(id)
);