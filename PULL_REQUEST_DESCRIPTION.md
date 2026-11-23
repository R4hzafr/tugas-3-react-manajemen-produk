# [Tugas 4] Ringkasan Fitur

## Ringkasan Perubahan

- Melanjutkan aplikasi Manajemen Produk dari Tugas 3 menggunakan template React dari dosen.
- Menambahkan React Router untuk halaman Dashboard, Daftar Produk, Detail Produk (`/products/:id`), dan halaman 404.
- Menambahkan layout bersama dengan navigasi Dashboard dan Daftar Produk.
- Menerapkan Tailwind CSS agar tampilan konsisten dan responsif.
- Mengintegrasikan proses baca, tambah, edit, dan hapus produk melalui REST API backend.
- Menambahkan validasi response API serta kondisi loading, data kosong, dan error.

## Bukti Pengujian

Lampirkan screenshot atau video singkat untuk:

- [ ] Dashboard pada desktop dan ponsel.
- [ ] Daftar produk yang dimuat dari backend.
- [ ] Proses tambah produk.
- [ ] Proses edit produk.
- [ ] Proses hapus produk.
- [ ] Halaman detail produk (`/products/:id`).
- [ ] Halaman 404 ketika URL tidak ditemukan.

## Langkah Menjalankan Aplikasi

### Backend

Gunakan repository backend yang sudah dibuat pada tugas sebelumnya. Jalankan backend sesuai petunjuk pada README repository tersebut dan pastikan endpoint produk dapat diakses dari frontend. Sesuaikan alamat API pada `.env.local`.

### Frontend

```bash
npm ci
cp .env.example .env.local
```

Sesuaikan `VITE_API_BASE_URL` di `.env.local`, lalu jalankan:

```bash
npm run dev
```

## Pemeriksaan

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
