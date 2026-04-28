export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Logika HAPUS (DELETE)
    if (request.method === "DELETE" && url.pathname.startsWith("/api/santri/")) {
      const id = url.pathname.split("/").pop();
      try {
        await env.DB.prepare("DELETE FROM santri WHERE id = ?").bind(id).run();
        return new Response("Berhasil dihapus", { status: 200 });
      } catch (e) {
        return new Response("Gagal menghapus: " + e.message, { status: 500 });
      }
    }

// Logika UPDATE (PUT)

if (request.method === "PUT" && url.pathname.startsWith("/api/santri/")) {
  // 1. Ambil ID dari URL dulu
  const id = url.pathname.split("/").pop(); 
  
  try {
    // 2. Baru ambil data dari body form
    const body = await request.json(); 
    
    // 3. Jalankan Query SQL
    const sql = `UPDATE santri SET 
      nama=?, NIK=?, TTL=?, kelas=?, No_KK=?, Ayah=?, NIK_Ayah=?, Ibu=?, NIK_Ibu=? 
      WHERE id=?`;
      
    await env.DB.prepare(sql)
      .bind(
        body.nama, body.nik, body.ttl, body.kelas, 
        body.no_kk, body.ayah, body.nik_ayah, body.ibu, body.nik_ibu, 
        id 
      )
      .run();
      
    return new Response("Update Berhasil", { status: 200 });
  } catch (e) {
    // Kalau ini muncul, cek terminal untuk liat error detailnya
    return new Response("Gagal update: " + e.message, { status: 500 });
  }
}
    // 2. Logika TAMBAH (POST)
    if (request.method === "POST" && url.pathname === "/api/santri") {
  try {
    const body = await request.json();
    
    // Pastikan nama kolom (huruf besar/kecil) SAMA PERSIS dengan di database kamu
    const sql = `INSERT INTO santri 
      (nama, NIK, TTL, kelas, No_KK, Ayah, NIK_Ayah, Ibu, NIK_Ibu, status_aktif) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
      
    await env.DB.prepare(sql)
        .bind(
            body.nama || "", 
            body.nik || "", 
            body.ttl || "", 
            body.kelas || "", 
            body.no_kk || "", 
            body.ayah || "", 
            body.nik_ayah || "", 
            body.ibu || "", 
            body.nik_ibu || ""
        )
  .run();
      
    return new Response("Berhasil ditambah", { status: 201 });
  } catch (e) {
    // Ini akan memunculkan pesan error spesifik di terminal jika gagal
    console.error("Database Error:", e.message);
    return new Response("Gagal menambah: " + e.message, { status: 500 });
  }
}
    // 3. Logika AMBIL DATA (GET)
    if (url.pathname === "/api/santri") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM santri").all();
        return Response.json(results);
      } catch (e) {
        return new Response("Gagal mengambil data", { status: 500 });
      }
    }

    // 4. Logika TAMPILAN (Frontend Assets)
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("Halaman tidak ditemukan", { status: 404 });
    }
  },
};