export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Logika EDIT/UPDATE (PUT)
    if (request.method === "PUT" && url.pathname.startsWith("/api/santri/")) {
      const id = url.pathname.split("/").pop();
      const body = await request.json();
      await env.DB.prepare("UPDATE santri SET nama = ?, kelas = ? WHERE id = ?")
        .bind(body.nama, body.kelas, id)
        .run();
      return new Response("Update Berhasil", { status: 200 });
    }

    // 2. Logika HAPUS (DELETE)
    if (request.method === "DELETE" && url.pathname.startsWith("/api/santri/")) {
      const id = url.pathname.split("/").pop();
      await env.DB.prepare("DELETE FROM santri WHERE id = ?").bind(id).run();
      return new Response("Berhasil dihapus", { status: 200 });
    }

    // 3. Logika TAMBAH (POST)
    if (request.method === "POST" && url.pathname === "/api/santri") {
      const body = await request.json();
      await env.DB.prepare("INSERT INTO santri (nama, kelas, status_aktif) VALUES (?, ?, 1)")
        .bind(body.nama, body.kelas)
        .run();
      return new Response("Berhasil ditambah", { status: 201 });
    }

    // 4. Logika AMBIL DATA (GET API)
    if (url.pathname === "/api/santri") {
      const { results } = await env.DB.prepare("SELECT * FROM santri").all();
      return Response.json(results);
    }

    // 5. Logika TAMPILAN (Frontend Assets)
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("Halaman tidak ditemukan", { status: 404 });
    }
  },
};