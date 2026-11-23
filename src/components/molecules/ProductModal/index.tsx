import { useState, type FormEvent } from "react"
import { TbAlertTriangle, TbX } from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import Button from "../../atoms/Button"

type Props = {
    mode: "add" | "edit" | "delete"
    product?: Product
    isSubmitting: boolean
    error: string
    onClose: () => void
    onSubmit: (values: ProductValues) => void
    onDelete: () => void
}

export default function ProductModal({
    mode,
    product,
    isSubmitting,
    error,
    onClose,
    onSubmit,
    onDelete,
}: Props) {
    const [name, setName] = useState(product?.name ?? "")
    const [price, setPrice] = useState(product ? String(product.price) : "")

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({ name: name.trim(), price: Number(price) })
    }

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                className="my-auto w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
                {mode === "delete" ? (
                    <>
                        <div className="mb-5 grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
                            <TbAlertTriangle className="size-6" aria-hidden="true" />
                        </div>
                        <p className="text-[10px] font-extrabold tracking-[1.4px] text-red-500">
                            KONFIRMASI PENGHAPUSAN
                        </p>
                        <h2
                            id="product-modal-title"
                            className="mt-2 text-2xl font-bold text-slate-800"
                        >
                            Hapus produk?
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Kamu yakin ingin menghapus produk{" "}
                            <strong className="text-slate-700">
                                {product?.name}
                            </strong>
                            ? Data akan dihapus melalui backend dan tidak dapat
                            dikembalikan.
                        </p>
                        {error && (
                            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}
                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button variant="danger" onClick={onDelete} disabled={isSubmitting}>
                                {isSubmitting ? "Menghapus…" : "Ya, Hapus Produk"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-extrabold tracking-[1.4px] text-blue-600">
                                    MANAJEMEN PRODUK
                                </p>
                                <h2
                                    id="product-modal-title"
                                    className="mt-2 text-2xl font-bold text-slate-800"
                                >
                                    {mode === "add" ? "Tambah Produk" : "Edit Produk"}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {mode === "add"
                                        ? "Masukkan informasi produk baru ke dalam daftar."
                                        : "Perbarui informasi produk yang dipilih."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                aria-label="Tutup modal"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <TbX className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="product-name" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nama Produk
                                </label>
                                <input
                                    id="product-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Contoh: Pulpen"
                                    maxLength={120}
                                    required
                                    autoFocus
                                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="product-price" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Harga (Rp)
                                </label>
                                <input
                                    id="product-price"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    placeholder="Contoh: 5000"
                                    required
                                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>
                            {error && (
                                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    {error}
                                </p>
                            )}
                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSubmitting || !name.trim() || !price || Number(price) <= 0}>
                                    {isSubmitting
                                        ? "Menyimpan…"
                                        : mode === "add"
                                          ? "Simpan Produk"
                                          : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </section>
        </div>
    )
}
