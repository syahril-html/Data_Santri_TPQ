/**
 * FILE: guru.js
 * Deskripsi: Mengelola CRUD Data Guru dengan Cloudflare Worker & D1
 */

// Konfigurasi URL API Cloudflare kamu
const API_URL = 'https://tpq-app.syahrilril921.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem Data Guru Terkoneksi...");
    
    // 1. Jalankan fungsi ambil data agar tabel terisi saat halaman dibuka
    muatDataGuru(); 
    
    // 2. Inisialisasi Event Listener untuk Form
    const formGuru = document.getElementById('formTambahGuru');
    if (formGuru) {
        formGuru.addEventListener('submit', simpanDataGuru);
    }
});

/**
 * 1. FUNGSI AMBIL DATA (GET)
 * Mengambil data guru dari database Cloudflare
 */
async function muatDataGuru() {
    const tabelGuru = document.getElementById('tabel-guru-body');
    if (!tabelGuru) return;

    tabelGuru.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/api/guru`); // Sesuaikan endpoint API kamu
        
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        
        const daftarGuru = await response.json();
        renderTabelGuru(daftarGuru);

    } catch (error) {
        console.error('Error muatDataGuru:', error);
        tabelGuru.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data. Pastikan CORS sudah diaktifkan di Worker.</td></tr>';
    }
}

/**
 * 2. FUNGSI TAMPILKAN DATA (RENDER)
 * Menulis ulang isi tabel berdasarkan data yang diterima
 */
function renderTabelGuru(data) {
    const tabelGuru = document.getElementById('tabel-guru-body');
    tabelGuru.innerHTML = ""; 

    if (data.length === 0) {
        tabelGuru.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada data guru.</td></tr>';
        return;
    }

    data.forEach((guru, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${guru.nama}</td>
                <td>${guru.nip}</td>
                <td>${guru.jabatan}</td>
                <td>
                    <button class="btn-detail" onclick="detailGuru('${guru.id}')" style="background:#3498db; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">detail</button>
                    <button class="btn-edit" onclick="editGuru('${guru.id}')" style="background:#ffc107; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Edit</button>
                    <button class="btn-delete" onclick="hapusGuru('${guru.id}')" style="background:#dc3545; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">Hapus</button>
                </td>
            </tr>`;
        tabelGuru.innerHTML += row;
    });
}

/**
 * 3. FUNGSI SIMPAN DATA (POST)
 * Mengirim data dari form ke Cloudflare
 */
async function simpanDataGuru(e) {
    e.preventDefault();

    const btnSimpan = e.target.querySelector('button[type="submit"]');
    const dataBaru = {
        nama: document.getElementById('nama-guru').value,
        nip: document.getElementById('nip-guru').value,
        jabatan: document.getElementById('jabatan-guru').value
    };

    // Validasi sederhana
    if (!dataBaru.nama || !dataBaru.nip) {
        alert("Nama dan NIP wajib diisi!");
        return;
    }

    try {
        btnSimpan.disabled = true;
        btnSimpan.innerText = "Menyimpan...";

        const res = await fetch(`${API_URL}/api/guru`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataBaru)
        });

        if (res.ok) {
            alert("Berhasil simpan data guru!");
            tutupModalGuru();
            muatDataGuru(); 
        } else {
            const errorText = await res.text();
            throw new Error(errorText);
        }
    } catch (err) {
        console.error('Error simpanDataGuru:', err);
        alert("Gagal tersambung ke Database. Pastikan Worker sudah dikonfigurasi dengan CORS.");
    } finally {
        btnSimpan.disabled = false;
        btnSimpan.innerText = "Simpan Guru";
    }
}

/**
 * 4. FUNGSI MODAL & NAVIGASI
 */
function bukaModalGuru() {
    const modal = document.getElementById('modalTambahGuru');
    if (modal) modal.style.display = 'flex';
}

function tutupModalGuru() {
    const modal = document.getElementById('modalTambahGuru');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('formTambahGuru').reset();
    }
}

// Mengekspos fungsi ke jendela global agar bisa dipanggil dari HTML onclick atau file lain
window.muatDataGuru = muatDataGuru;
window.bukaModalGuru = bukaModalGuru;
window.tutupModalGuru = tutupModalGuru;

async function hapusGuru(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) return;

    try {
        // Gunakan id yang dikirim dari tombol
        const response = await fetch(`${API_URL}/api/guru/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Data guru berhasil dihapus!");
            // Refresh tabel tanpa reload halaman penuh
            muatDataGuru(); 
        } else {
            const pesanError = await response.text();
            alert("Gagal menghapus: " + pesanError);
        }
    } catch (error) {
        console.error("Error Hapus:", error);
        alert("Koneksi gagal atau masalah CORS.");
    }
}