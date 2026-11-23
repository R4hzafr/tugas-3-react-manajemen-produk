import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { TbArrowLeft, TbPackage, TbTag } from "react-icons/tb"
import type { Product } from "../../../types/product"
import productRepository from "../../../utils/product-repository"
import { formatRupiah } from "../../../utils/formatRupiah"

type DetailState =
    | { id: string | undefined; status: "loading" }
    | { id: string | undefined; status: "ready"; product: Product }
    | { id: string | undefined; status: "not-found" }
    | { id: string | undefined; status: "error"; message: string }

export default function ProductDetailPage() {
    const { id } = useParams()
    const [detail, setDetail] = useState<DetailState>({
        id: undefined,
        status: "loading",
    })
    const currentDetail: DetailState =
        detail.id === id ? detail : { id, status: "loading" }

    useEffect(() => {
        let isCurrent = true
        const productRequest = /^\d+$/.test(id ?? "")
            ? productRepository.getProductById(Number(id))
            : Promise.reject(new Error("HTTP 404"))

        productRequest
            .then((model) => {
                if (isCurrent) {
                    setDetail({
                        id,
                        status: "ready",
                        product: model.toJSON(),
                    })
                }
            })
            .catch((error: unknown) => {
                if (!isCurrent) return
                const message =
                    error instanceof Error ? error.message : "Gagal memuat detail produk."
                if (message.includes("404")) {
                    setDetail({ id, status: "not-found" })
                } else {
                    setDetail({ id, status: "error", message })
                }
            })

        return () => {
            isCurrent = false
        }
    }, [id])

    if (currentDetail.status === "loading") {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
                <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-5 w-1/3 animate-pulse rounded bg-slate-100" />
            </div>
        )
    }

    if (currentDetail.status === "not-found") {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                    <TbPackage className="size-8" aria-hidden="true" />
                </div>
                <p className="mt-5 text-[10px] font-extrabold tracking-[1.5px] text-amber-600">
                    PRODUK TIDAK DITEMUKAN
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-800">
                    Data produk tidak tersedia
                </h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Produk dengan ID {id} tidak ditemukan. Periksa kembali alamat
                    halaman atau pilih produk dari daftar.
                </p>
                <Link
                    to="/products"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-blue-700 hover:bg-blue-700"
                >
                    <TbArrowLeft className="size-4" aria-hidden="true" />
                    Kembali ke Daftar Produk
                </Link>
            </section>
        )
    }

    if (currentDetail.status === "error") {
        return (
            <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-bold text-red-800">
                    Gagal memuat detail produk
                </h1>
                <p className="mt-2 text-sm leading-6 text-red-700">
                    {currentDetail.message}
                </p>
                <Link
                    to="/products"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    <TbArrowLeft className="size-4" aria-hidden="true" />
                    Kembali ke Daftar Produk
                </Link>
            </section>
        )
    }

    const { product } = currentDetail

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
                >
                    <TbArrowLeft className="size-4" aria-hidden="true" />
                    Kembali ke Daftar Produk
                </Link>
                <p className="mt-6 text-[10px] font-extrabold tracking-[1.5px] text-blue-600">
                    DETAIL PRODUK / ID {product.id}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                    Informasi Produk
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Detail data produk yang diambil berdasarkan parameter ID pada URL.
                </p>
            </div>

            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.035)]">
                <div className="flex flex-col gap-5 bg-[#1e3a70] px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div className="flex items-center gap-4">
                        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10">
                            <TbPackage className="size-7" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-[1.3px] text-blue-200">
                                PRODUK #{product.id}
                            </p>
                            <h2 className="mt-1 wrap-break-word text-2xl font-extrabold">
                                {product.name}
                            </h2>
                        </div>
                    </div>
                    <span className="w-fit rounded-full bg-emerald-400/15 px-4 py-2 text-xs font-bold text-emerald-100">
                        Data dari backend
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-8">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <TbTag className="size-4" aria-hidden="true" />
                            <span className="text-xs font-semibold">ID Produk</span>
                        </div>
                        <p className="mt-3 text-xl font-bold text-slate-800">{product.id}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <TbPackage className="size-4" aria-hidden="true" />
                            <span className="text-xs font-semibold">Nama Produk</span>
                        </div>
                        <p className="mt-3 wrap-break-word text-xl font-bold text-slate-800">
                            {product.name}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:col-span-2">
                        <p className="text-xs font-semibold text-blue-600">Harga Produk</p>
                        <p className="mt-2 text-3xl font-extrabold text-blue-800">
                            {formatRupiah(product.price)}
                        </p>
                    </div>
                </div>
            </article>
        </div>
    )
}
