# Backend Manajemen Produk

Backend REST API menggunakan ExpressJS dan SQLite bawaan Node.js (`node:sqlite`). Tidak perlu memasang aplikasi database terpisah.

## Persyaratan

- Node.js 22.13 atau lebih baru.
- npm.

## Menjalankan backend

```bash
cd backend
npm install
npm run dev
```

Server berjalan pada `http://127.0.0.1:3000`.

- Health check: `GET http://127.0.0.1:3000/api/health`
- Daftar produk: `GET http://127.0.0.1:3000/api/products`

Database dibuat otomatis pada `backend/data/products.db`. Saat database masih kosong, lima produk contoh dari Tugas 3 akan dimasukkan otomatis. Jangan menghapus file database jika ingin mempertahankan data yang sudah ditambahkan.

## Endpoint

| Method | Endpoint | Kegunaan |
| --- | --- | --- |
| GET | `/api/health` | Memeriksa server |
| GET | `/api/products` | Mengambil semua produk |
| GET | `/api/products?q=pul` | Mencari produk berdasarkan nama |
| GET | `/api/products/:id` | Mengambil detail produk |
| POST | `/api/products` | Menambahkan produk |
| PUT | `/api/products/:id` | Memperbarui produk |
| DELETE | `/api/products/:id` | Menghapus produk |

Body POST/PUT:

```json
{
  "name": "Pulpen",
  "price": 5000
}
```

Harga harus berupa bilangan bulat positif. Nama produk wajib diisi dan maksimal 100 karakter.

## Konfigurasi opsional

Salin `.env.example` menjadi `.env` jika ingin mengubah port, host, atau origin frontend. Server membaca variabel lingkungan dari terminal; untuk penggunaan lokal standar, nilai default sudah cukup.
