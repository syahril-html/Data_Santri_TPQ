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

        document.getElementById('formTambah').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Pastikan ID di dalam kurung ini ada di index.html kamu
            const dataBaru = {
                nama: document.getElementById('nama')?.value || "",
                nik: document.getElementById('nik')?.value || "",
                ttl: document.getElementById('ttl')?.value || "",
                kelas: document.getElementById('kelas')?.value || "",
                no_kk: document.getElementById('no_kk')?.value || "",
                ayah: document.getElementById('ayah')?.value || "",
                nik_ayah: document.getElementById('nik_ayah')?.value || "",
                ibu: document.getElementById('ibu')?.value || "",
                nik_ibu: document.getElementById('nik_ibu')?.value || ""
            };

            console.log("Data yang akan dikirim:", dataBaru); // Cek di console f12

            try {
                const res = await fetch('/api/santri', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataBaru)
                });

                if (res.ok) {
                    alert("Santri Berhasil Ditambah!");
                    location.reload();
                } else {
                    const errorText = await res.text();
                    alert("Gagal: " + errorText);
                }
            } catch (err) {
                console.error("Error POST:", err);
            }
        });

        window.toggleTambah = function() {
            const modal = document.getElementById('modalTambah');
            // Jika modal sedang sembunyi, tampilkan. Jika sedang tampil, sembunyikan.
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            } else {
                modal.style.display = 'flex';
            }
        };

        data.forEach((santri, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${santri.nama}</strong></td>
                <td>${santri.NIK || '-'}</td>
                <td>${santri.TTL || '-'}</td>
                <td>${santri.kelas}</td>
                <td>${santri.No_KK || '-'}</td>
                <td>${santri.Ayah || '-'}</td>
                <td>${santri.NIK_Ayah || '-'}</td>
                <td>${santri.Ibu || '-'}</td>
                <td>${santri.NIK_Ibu || '-'}</td>
                <td><span class="badge-active">Aktif</span></td>
                <td>
                    <button class="btn-detail" onclick="tampilDetail(${santri.id})">Detail</button>
                    <button class="btn-edit" onclick="editSantri(${santri.id})">Edit</button>
                    <button class="btn-delete" onclick="hapusSantri(${santri.id})">Delete</button>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
        console.log("Tabel berhasil diupdate!");
    } 

    catch (error) {
        console.error("Gagal memuat API:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Gagal memuat data dari server</td></tr>';
    }

    window.hapusSantri = async function(id) {
        if (confirm("Apakah Anda yakin ingin menghapus data santri ini?")) {
            try {
                const response = await fetch(`/api/santri/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert("Data berhasil dihapus!");
                    location.reload(); // Refresh tabel setelah hapus
                } else {
                    alert("Gagal menghapus data.");
                }
            } catch (err) {
                console.error("Error:", err);
            }
        }
    };

        // 1. Fungsi untuk menampilkan Modal dan mengisi datanya
    window.editSantri = async function(id) {
        try {
            const res = await fetch('/api/santri');
            
            if (!res.ok) throw new Error("Gagal mengambil data dari server");
            
            const data = await res.json();
            // Cari data yang id-nya sesuai (pakai == agar fleksibel tipe datanya)
            const s = data.find(item => item.id == id);

            if (s) {
                // Isi semua field modal edit (sesuaikan dengan nama kolom database kamu)
                document.getElementById('edit-id').value = s.id;
                document.getElementById('edit-nama').value = s.nama;
                document.getElementById('edit-nik').value = s.NIK || '';
                document.getElementById('edit-ttl').value = s.TTL || '';
                document.getElementById('edit-kelas').value = s.kelas;
                document.getElementById('edit-no_kk').value = s.No_KK || '';
                document.getElementById('edit-ayah').value = s.Ayah || '';
                document.getElementById('edit-nik_ayah').value = s.NIK_Ayah || '';
                document.getElementById('edit-ibu').value = s.Ibu || '';
                document.getElementById('edit-nik_ibu').value = s.NIK_Ibu || '';
                
                // Munculkan Modal
                document.getElementById('modalEdit').style.display = 'flex';
            } else {
                alert("Data santri tidak ditemukan!");
            }
        } catch (err) {
            console.error("Error Detail:", err);
            alert("Server sedang mati! Pastikan 'npx wrangler dev' sudah jalan.");
        }
    };
    // 2. Fungsi untuk mengirim perubahan ke Database
    document.getElementById('formEdit').addEventListener('submit', async (e) => {
        e.preventDefault(); // Sangat penting agar halaman tidak reload sendiri
        
        const id = document.getElementById('edit-id').value;
        const dataUpdate = {
            nama: document.getElementById('edit-nama').value,
            nik: document.getElementById('edit-nik').value,
            ttl: document.getElementById('edit-ttl').value,
            kelas: document.getElementById('edit-kelas').value,
            no_kk: document.getElementById('edit-no_kk').value,
            ayah: document.getElementById('edit-ayah').value,
            nik_ayah: document.getElementById('edit-nik_ayah').value,
            ibu: document.getElementById('edit-ibu').value,
            nik_ibu: document.getElementById('edit-nik_ibu').value
        };

        try {
            const res = await fetch(`/api/santri/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataUpdate)
            });

            if (res.ok) {
                alert("Data Berhasil Diupdate!");
                location.reload(); 
            } else {
                alert("Gagal mengupdate data di server.");
            }
        } catch (error) {
            console.error("Error saat update:", error);
        }
    });

    window.toggleEdit = function() {
        const modal = document.getElementById('modalEdit');
        modal.style.display = 'none'; // Sembunyikan modal
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