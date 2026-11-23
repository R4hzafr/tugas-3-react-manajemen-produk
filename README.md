# Tugas 4 — Manajemen Produk

Project Tugas 4 dikembangkan menggunakan template React dari dosen dan melanjutkan fitur manajemen produk Tugas 3. Repository ini berisi frontend React dan backend ExpressJS dalam satu project.

## Fitur

- Dashboard dan navigasi halaman.
- Daftar produk dari REST API.
- Tambah, lihat detail, edit, dan hapus produk.
- Detail produk dengan route `/products/:id`.
- Halaman 404 untuk route yang tidak tersedia.
- Pencarian produk berdasarkan nama.
- Loading, empty state, dan pesan error.
- Tampilan responsif dengan Tailwind CSS.
- Penyimpanan permanen menggunakan SQLite.

## Teknologi

**Frontend:** React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4.

**Backend:** Node.js, ExpressJS 5, SQLite melalui modul bawaan `node:sqlite`.

## Persyaratan

Gunakan Node.js **22.13 atau lebih baru** dan npm. Tidak perlu menginstal MySQL atau aplikasi database terpisah.

## Menjalankan project

Buka dua terminal di VS Code. Backend dan frontend harus berjalan bersamaan.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

Backend aktif di `http://127.0.0.1:3000`.

Cek di browser: `http://127.0.0.1:3000/api/health`.

### Terminal 2 — Frontend

Dari folder utama project:

```bash
npm ci
```

Buat file `.env.local` di folder utama, lalu isi:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

Jalankan frontend:

```bash
npm run dev
```

Buka URL Vite yang muncul di terminal, biasanya `http://localhost:5173`.

## Database

File SQLite dibuat otomatis di `backend/data/products.db`. Pada penggunaan pertama, backend mengisi lima data awal yang sama dengan Tugas 3: Pulpen, Buku Tulis, Spidol, Penggaris, dan Penghapus. Perubahan produk tersimpan di file database tersebut.

## Endpoint API

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/health` | Memeriksa backend |
| GET | `/api/products` | Mengambil daftar produk |
| GET | `/api/products/:id` | Mengambil detail produk |
| POST | `/api/products` | Menambahkan produk |
| PUT | `/api/products/:id` | Mengedit produk |
| DELETE | `/api/products/:id` | Menghapus produk |

Body untuk POST dan PUT:

```json
{
  "name": "Pulpen",
  "price": 5000
}
```

## Pemeriksaan frontend

Jalankan dari folder utama:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Git dan Pull Request

Tetap gunakan repository Tugas 3. Kerjakan Tugas 4 di branch `tugas-4`, lalu buat Pull Request ke `main` dengan judul:

```text
[Tugas 4] Ringkasan Fitur
```

Isi deskripsi PR dengan ringkasan fitur, bukti pengujian, dan langkah menjalankan frontend serta backend. Lihat `PULL_REQUEST_DESCRIPTION.md` sebagai draft deskripsi.
