async function ambilData() {
    console.log("Memulai ambil data...");
    const tbody = document.getElementById('tabel-santri');
    
    if (!tbody) {
        console.error("Elemen 'tabel-santri' tidak ditemukan di HTML!");
        return;
    }

    try {
        const response = await fetch('/api/santri');
        const data = await response.json();
        console.log("Data diterima:", data);

        tbody.innerHTML = ''; 

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Data kosong</td></tr>';
            return;
        }
         window.toggleTambah = function() {
            const area = document.getElementById('areaTambah');
            if (area.style.display === 'none') {
                area.style.display = 'block'; // Munculkan
            } else {
                area.style.display = 'none'; // Sembunyikan
            }
        };

        data.forEach(santri => {
            const row = `
                <tr>
                    <td>${santri.id}</td>
                    <td><strong>${santri.nama}</strong></td>
                    <td>${santri.kelas || '-'}</td> <td><span class="badge-active">${santri.status_aktif == 1 ? 'Aktif' : 'Non-Aktif'}</span></td>
                    <td>
                        <button class="btn-detail" onclick="tampilDetail(${santri.id})">Detail</button>
                        <button class="btn-edit" onclick="editSantri(${santri.id})">Edit</button>
                        <button class="btn-delete"onclick="hapusSantri(${santri.id})">Delete</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
        console.log("Tabel berhasil diupdate!");
    } catch (error) {
        console.error("Gagal memuat API:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data dari server</td></tr>';
    }
        window.hapusSantri = async function(id) {
        if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            try {
                const response = await fetch(`/api/santri/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert("Data berhasil dihapus!");
                    ambilData(); // Panggil fungsi ini untuk refresh tabel tanpa reload halaman
                } else {
                    alert("Gagal menghapus data di server.");
                }
            } catch (error) {
                console.error("Error saat menghapus:", error);
                alert("Terjadi kesalahan koneksi.");
            }
        }
    };
        // 1. Fungsi untuk menampilkan Modal dan mengisi datanya
    window.editSantri = async function(id) {
        const response = await fetch('/api/santri');
        const allData = await response.json();
        const santri = allData.find(s => s.id === id);

        if (santri) {
            document.getElementById('edit-id').value = santri.id;
            document.getElementById('edit-nama').value = santri.nama;
            document.getElementById('edit-kelas').value = santri.kelas;
            document.getElementById('modalEdit').style.display = 'block';
        }
    };

    // 2. Fungsi untuk mengirim perubahan ke Database
    window.simpanEdit = async function() {
    const id = document.getElementById('edit-id').value;
    const nama = document.getElementById('edit-nama').value;
    const kelas = document.getElementById('edit-kelas').value;

    try {
        const response = await fetch(`/api/santri/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nama: nama, 
                kelas: kelas 
            })
        });

        if (response.ok) {
            alert("Perubahan berhasil disimpan!");
            document.getElementById('modalEdit').style.display = 'none';
            ambilData(); // Penting: memanggil ulang data agar tabel terupdate
        } else {
            alert("Gagal menyimpan perubahan ke server.");
        }
    } catch (err) {
        console.error("Kesalahan:", err);
    }
};
        window.tampilDetail = async function(id) {
        try {
            const response = await fetch('/api/santri');
            const allData = await response.json();
            // Cari santri yang ID-nya cocok
            const santri = allData.find(s => s.id === id);

            if (santri) {
                const wadahDetail = document.getElementById('isiDetail');
                wadahDetail.innerHTML = `
                    <p><strong>ID/NIS:</strong> ${santri.id}</p>
                    <p><strong>Nama Lengkap:</strong> ${santri.nama}</p>
                    <p><strong>Kelas / Jilid:</strong> ${santri.kelas || '-'}</p>
                    <p><strong>Status:</strong> ${santri.status_aktif == 1 ? '<span style="color:green">Aktif</span>' : '<span style="color:red">Non-Aktif</span>'}</p>
                    <hr>
                    <small style="color:gray;">Terakhir diperbarui: ${new Date().toLocaleDateString('id-ID')}</small>
                `;
                document.getElementById('modalDetail').style.display = 'block';
            }
        } catch (error) {
            console.error("Gagal mengambil detail:", error);
            alert("Gagal memuat detail santri.");
        }
    };
    window.simpanSantri = async function() {
    const nama = document.getElementById('namaBaru').value;
    const kelas = document.getElementById('kelasBaru').value;

    if (!nama || !kelas) {
        alert("Mohon isi Nama dan Kelas terlebih dahulu!");
        return;
    }

    try {
        const response = await fetch('/api/santri', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: nama,
                kelas: kelas
            })
        });

            if (response.ok) {
                alert("Santri baru berhasil ditambahkan!");
                
                // Kosongkan form setelah simpan
                document.getElementById('namaBaru').value = '';
                document.getElementById('kelasBaru').value = '';
                
                // Sembunyikan area tambah dan refresh tabel
                toggleTambah(); 
                ambilData(); 
            } else {
                const pesanError = await response.text();
                alert("Gagal menyimpan: " + pesanError);
            }
        } catch (error) {
            console.error("Error koneksi:", error);
            alert("Terjadi kesalahan koneksi ke server.");
        }
    };
}

ambilData();