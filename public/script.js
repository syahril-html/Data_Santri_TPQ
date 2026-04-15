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

        data.forEach(santri => {
            const row = `
                <tr>
                    <td>${santri.id}</td>
                    <td><strong>${santri.nama}</strong></td>
                    <td>${santri.kelas}</td>
                    <td><span class="badge-active">Aktif</span></td>
                    <td>
                        <button class="btn-detail">Detail</button>
                        <button class="btn-edit">Edit</button>
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
}

ambilData();