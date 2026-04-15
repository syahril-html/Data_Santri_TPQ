document.addEventListener('DOMContentLoaded', () => {
    ambilData();
});

async function ambilData() {
    const tbody = document.getElementById('tabel-santri');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Sedang mengambil data...</td></tr>';

    try {
        // Mengambil data dari endpoint API di Worker
        const response = await fetch('/api/santri');
        const data = await response.json();

        tbody.innerHTML = ''; // Kosongkan loading

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Tidak ada santri aktif.</td></tr>';
            return;
        }

        data.forEach(santri => {
            const row = `
                <tr>
                    <td>${santri.id}</td>
                    <td><strong>${santri.nama}</strong></td>
                    <td>${santri.kelas}</td>
                    <td><span class="badge-active">Aktif</span></td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Gagal memuat data.</td></tr>';
    }
}