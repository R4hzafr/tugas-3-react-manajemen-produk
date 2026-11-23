import { useEffect, useMemo, useState } from "react"
import { TbPlus, TbRefresh, TbSearch } from "react-icons/tb"
import type { Product, ProductValues } from "../../../types/product"
import productRepository from "../../../utils/product-repository"
import Button from "../../atoms/Button"
import ProductGrid from "../../organisms/ProductGrid"
import ProductModal from "../../molecules/ProductModal"

type ModalState =
    | { type: "add" }
    | { type: "edit"; product: Product }
    | { type: "delete"; product: Product }
    | null

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Terjadi kesalahan pada aplikasi."
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [modal, setModal] = useState<ModalState>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [actionError, setActionError] = useState("")
    const [notice, setNotice] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        let isCurrent = true

        async function loadProducts() {
            try {
                const models = await productRepository.getProductList()
                if (isCurrent) {
                    setProducts(models.map((model) => model.toJSON()))
                    setError("")
                }
            } catch (loadError) {
                if (isCurrent) setError(getErrorMessage(loadError))
            } finally {
                if (isCurrent) setIsLoading(false)
            }
        }

        void loadProducts()
        return () => {
            isCurrent = false
        }
    }, [refreshKey])

    const filteredProducts = useMemo(
        () =>
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
            ),
        [products, searchTerm],
    )

    function openModal(nextModal: ModalState) {
        setActionError("")
        setModal(nextModal)
    }

    async function handleSaveProduct(values: ProductValues) {
        const activeModal = modal
        if (!activeModal || activeModal.type === "delete") return

        setIsSubmitting(true)
        setActionError("")
        try {
            if (activeModal.type === "add") {
                await productRepository.createProduct(values)
                setNotice("Produk berhasil ditambahkan melalui backend.")
            } else {
                await productRepository.updateProduct(activeModal.product.id, values)
                setNotice("Perubahan produk berhasil disimpan melalui backend.")
            }
            setModal(null)
            setIsLoading(true)
            setRefreshKey((current) => current + 1)
        } catch (saveError) {
            setActionError(getErrorMessage(saveError))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteProduct() {
        if (!modal || modal.type !== "delete") return

        setIsSubmitting(true)
        setActionError("")
        try {
            await productRepository.deleteProduct(modal.product.id)
            setNotice("Produk berhasil dihapus dari backend.")
            setModal(null)
            setIsLoading(true)
            setRefreshKey((current) => current + 1)
        } catch (deleteError) {
            setActionError(getErrorMessage(deleteError))
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleRefresh() {
        setNotice("")
        setError("")
        setIsLoading(true)
        setRefreshKey((current) => current + 1)
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#1e3a70] px-6 py-8 text-white shadow-[0_12px_30px_rgba(30,58,112,0.13)] sm:flex-row sm:items-center sm:px-8 sm:py-9">
                <div>
                    <p className="text-[10px] font-extrabold tracking-[1.6px] text-blue-200">
                        DASHBOARD / PRODUK
                    </p>
                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Kelola Produk Anda
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                        Tambah, lihat, ubah, dan hapus data produk yang tersimpan
                        pada backend.
                    </p>
                </div>
                <Button
                    onClick={() => openModal({ type: "add" })}
                    className="min-h-12 shrink-0 border-white bg-white px-5 text-[#1e3a70] shadow-sm hover:border-blue-100 hover:bg-blue-50"
                >
                    <TbPlus className="size-5" aria-hidden="true" />
                    Tambah Produk
                </Button>
            </section>

            <section>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-[10px] font-extrabold tracking-[1.5px] text-blue-600">
                            DATA PRODUK
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                            Daftar Produk
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Kelola seluruh produk yang tersedia.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 sm:w-[280px]">
                            <TbSearch className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Cari nama produk..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                aria-label="Cari nama produk"
                            />
                        </label>
                        <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
                            <TbRefresh className="size-4" aria-hidden="true" />
                            Muat Ulang
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <p>
                        Menampilkan <strong className="text-slate-700">{filteredProducts.length}</strong> dari{" "}
                        <strong className="text-slate-700">{products.length}</strong> produk
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Data melalui API
                    </span>
                </div>

                {notice && (
                    <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {notice}
                    </p>
                )}

                {error && (
                    <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <h3 className="font-bold text-red-800">
                            Gagal memuat data produk
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
                        <p className="mt-2 text-xs leading-5 text-red-600">
                            Pastikan backend aktif, alamat VITE_API_BASE_URL benar,
                            dan backend mengizinkan request dari alamat frontend melalui CORS.
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Memuat produk">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-[280px] animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                                <div className="h-5 w-20 rounded bg-slate-100" />
                                <div className="mt-8 size-12 rounded-xl bg-slate-100" />
                                <div className="mt-6 h-4 w-2/3 rounded bg-slate-100" />
                                <div className="mt-4 h-6 w-1/2 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : !error && filteredProducts.length > 0 ? (
                    <div className="mt-5" aria-busy={isSubmitting}>
                        <ProductGrid
                            products={filteredProducts}
                            onEdit={(product) => openModal({ type: "edit", product })}
                            onDelete={(product) => openModal({ type: "delete", product })}
                        />
                    </div>
                ) : !error ? (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                            <TbSearch className="size-6" aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-slate-800">
                            {products.length === 0
                                ? "Belum ada produk"
                                : "Produk tidak ditemukan"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {products.length === 0
                                ? "Belum ada data produk dari backend. Tambahkan produk pertama untuk memulai."
                                : "Coba gunakan kata kunci pencarian yang berbeda."}
                        </p>
                        {products.length === 0 && (
                            <Button onClick={() => openModal({ type: "add" })} className="mt-5">
                                <TbPlus className="size-4" aria-hidden="true" />
                                Tambah Produk
                            </Button>
                        )}
                    </div>
                ) : null}
            </section>

            {modal && (
                <ProductModal
                    key={`${modal.type}-${"product" in modal ? modal.product.id : "new"}`}
                    mode={modal.type}
                    product={"product" in modal ? modal.product : undefined}
                    isSubmitting={isSubmitting}
                    error={actionError}
                    onClose={() => openModal(null)}
                    onSubmit={handleSaveProduct}
                    onDelete={handleDeleteProduct}
                />
            )}
        </div>
    )
}
