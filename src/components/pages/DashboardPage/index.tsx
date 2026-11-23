import { Link } from "react-router"
import { TbArrowUpRight, TbDatabase, TbListDetails, TbRoute } from "react-icons/tb"

const highlights = [
    {
        icon: TbDatabase,
        title: "Terhubung dengan Backend",
        description:
            "Data produk dibaca dan diperbarui melalui REST API, bukan hanya state sementara di browser.",
    },
    {
        icon: TbListDetails,
        title: "Pengelolaan Produk",
        description:
            "Tambah, lihat, edit, hapus, dan cari produk dalam satu halaman yang terorganisasi.",
    },
    {
        icon: TbRoute,
        title: "Navigasi Antarhalaman",
        description:
            "Buka halaman detail produk berdasarkan ID dan kembali ke daftar tanpa memuat ulang aplikasi.",
    },
]

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl bg-[#1e3a70] px-6 py-9 text-white shadow-[0_14px_35px_rgba(30,58,112,0.16)] sm:px-9 sm:py-11">
                <div className="absolute -top-20 -right-14 size-64 rounded-full border-[36px] border-white/5" />
                <div className="absolute right-28 -bottom-32 size-64 rounded-full bg-blue-400/10 blur-2xl" />
                <div className="relative max-w-2xl">
                    <span className="text-[10px] font-extrabold tracking-[1.8px] text-blue-200 sm:text-xs">
                        DASHBOARD
                    </span>
                    <h1 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                        Kelola Produk Anda
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                        Kelola daftar produk dan harga dalam satu tempat. Setiap
                        perubahan data dikirim ke backend melalui API.
                    </p>
                    <Link
                        to="/products"
                        className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1e3a70] shadow-sm transition hover:bg-blue-50"
                    >
                        Buka Daftar Produk
                        <TbArrowUpRight className="size-5" aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <section>
                <div className="mb-5">
                    <p className="text-[10px] font-extrabold tracking-[1.5px] text-blue-600">
                        FITUR APLIKASI
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                        Semua kebutuhan produk dalam satu dashboard
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Aplikasi dikembangkan menggunakan React, React Router,
                        Tailwind CSS, dan integrasi backend.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {highlights.map(({ icon: Icon, title, description }, index) => (
                        <article
                            key={title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_14px_rgba(15,23,42,0.025)] sm:p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                    <Icon className="size-5" aria-hidden="true" />
                                </div>
                                <span className="text-xs font-bold text-slate-300">
                                    0{index + 1}
                                </span>
                            </div>
                            <h3 className="mt-5 text-base font-bold text-slate-800">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <p className="text-sm font-bold text-[#1e3a70]">
                        Mulai kelola data produk
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                        Buka daftar produk untuk melihat data yang tersedia dari backend.
                    </p>
                </div>
                <Link
                    to="/products"
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                    Lihat Produk
                </Link>
            </section>
        </div>
    )
}
