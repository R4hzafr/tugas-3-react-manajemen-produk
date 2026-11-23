import { Link } from "react-router"
import { TbArrowLeft, TbError404 } from "react-icons/tb"

export default function NotFoundPage() {
    return (
        <section className="grid min-h-[55vh] place-items-center rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="max-w-lg">
                <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-blue-50 text-blue-700">
                    <TbError404 className="size-12" aria-hidden="true" />
                </div>
                <p className="mt-6 text-[10px] font-extrabold tracking-[1.7px] text-blue-600">
                    ERROR 404
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
                    Halaman tidak ditemukan
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                    Maaf, halaman yang kamu cari tidak tersedia atau alamat URL
                    yang dimasukkan salah. Silakan kembali ke dashboard atau daftar produk.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/dashboard"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-blue-700 hover:bg-blue-700"
                    >
                        Kembali ke Dashboard
                    </Link>
                    <Link
                        to="/products"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        <TbArrowLeft className="size-4" aria-hidden="true" />
                        Daftar Produk
                    </Link>
                </div>
            </div>
        </section>
    )
}
