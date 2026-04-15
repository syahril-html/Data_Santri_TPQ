export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Jalur untuk mengambil data Santri (API)
    if (url.pathname === "/api/santri") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM santri WHERE status_aktif = 1"
      ).all();
      return Response.json(results);
    }

    // 2. Jalur untuk menampilkan file statis (HTML/CSS/JS)
    // Worker akan otomatis mencari file di folder 'public' jika sudah di-setting di toml
    return env.ASSETS.fetch(request);
  },
};