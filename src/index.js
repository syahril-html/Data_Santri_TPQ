export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // --- 2. LOGIKA UNTUK DATA GURU ---
      if (url.pathname.startsWith("/api/guru")) {
        if (method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM guru").all();
          return Response.json(results || [], { headers: corsHeaders });
        }

        // Hapus Data Guru
        if (method === "DELETE") {
          const id = url.pathname.split("/").pop();
          await env.DB.prepare("DELETE FROM guru WHERE id = ?").bind(id).run();
          return new Response("Guru Berhasil Dihapus", { status: 200, headers: corsHeaders });
        }
      }

      // Tambahkan ini di dalam blok route guru di index.js
      if (method === "POST") {
        try {
          const body = await request.json();
          const { nama, nip, jabatan } = body;

          await env.DB.prepare(
            "INSERT INTO guru (nama, nip, jabatan) VALUES (?, ?, ?)"
          ).bind(nama, nip, jabatan).run();

          return new Response("Data Guru Berhasil Ditambah", {
            status: 201,
            headers: corsHeaders
          });
        } catch (err) {
          return new Response("Gagal simpan: " + err.message, {
            status: 400,
            headers: corsHeaders
          });
        }
      }

      // --- 3. LOGIKA UNTUK DATA SANTRI ---
      if (url.pathname.startsWith("/api/santri")) {
        // Ambil Semua Santri
        if (method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM santri").all();
          return Response.json(results, { headers: corsHeaders });
        }

        // Tambah Santri
        if (method === "POST") {
          const body = await request.json();
          const sql = `INSERT INTO santri (nama, NIK, TTL, kelas, No_KK, Ayah, NIK_Ayah, Ibu, NIK_Ibu, status_aktif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
          await env.DB.prepare(sql).bind(
            body.nama || "", body.nik || "", body.ttl || "", body.kelas || "",
            body.no_kk || "", body.ayah || "", body.nik_ayah || "", body.ibu || "", body.nik_ibu || ""
          ).run();
          return new Response("Berhasil ditambah", { status: 201, headers: corsHeaders });
        }

        // Update Santri
        if (method === "PUT") {
          const id = url.pathname.split("/").pop();
          const body = await request.json();
          const sql = `UPDATE santri SET nama=?, NIK=?, TTL=?, kelas=?, No_KK=?, Ayah=?, NIK_Ayah=?, Ibu=?, NIK_Ibu=? WHERE id=?`;
          await env.DB.prepare(sql).bind(
            body.nama, body.nik, body.ttl, body.kelas,
            body.no_kk, body.ayah, body.nik_ayah, body.ibu, body.nik_ibu, id
          ).run();
          return new Response("Update Berhasil", { status: 200, headers: corsHeaders });
        }

        // Hapus Santri
        if (method === "DELETE") {
          const id = url.pathname.split("/").pop();
          await env.DB.prepare("DELETE FROM santri WHERE id = ?").bind(id).run();
          return new Response("Berhasil dihapus", { status: 200, headers: corsHeaders });
        }
      }

      // --- 4. JIKA TIDAK ADA PATH YANG COCOK ---
      return new Response("Not Found", { status: 404, headers: corsHeaders });

    } catch (e) {
      console.error("Error:", e.message);
      return new Response("Server Error: " + e.message, { status: 500, headers: corsHeaders });
    }
  },
};