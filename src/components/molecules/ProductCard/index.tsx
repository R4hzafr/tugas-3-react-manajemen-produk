import { Link } from "react-router"
import { TbEdit, TbEye, TbPackage, TbTrash } from "react-icons/tb"
import type { Product } from "../../../types/product"
import { formatRupiah } from "../../../utils/formatRupiah"
import Button from "../../atoms/Button"

type Props = {
    product: Product
    index: number
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductCard({
    product,
    index,
    onEdit,
    onDelete,
}: Props) {
    return (
        <article className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_3px_14px_rgba(15,23,42,0.025)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_28px_rgba(30,58,112,0.09)] sm:p-6">
            <div className="flex items-center justify-between">
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-500">
                    #{String(index + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Tersedia
                </span>
            </div>

            <div className="mt-7 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <TbPackage className="size-6" aria-hidden="true" />
            </div>
            <div className="mt-5 min-w-0 flex-1">
                <p className="text-[10px] font-extrabold tracking-[1.3px] text-slate-400">
                    PRODUK #{product.id}
                </p>
                <h2 className="mt-2 min-h-7 wrap-break-word text-lg font-bold text-slate-800">
                    {product.name}
                </h2>
                <p className="mt-4 text-xs font-medium text-slate-400">
                    Harga produk
                </p>
                <p className="mt-1 wrap-break-word text-xl font-extrabold text-blue-700">
                    {formatRupiah(product.price)}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <Link
                    to={`/products/${product.id}`}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    aria-label={`Detail ${product.name}`}
                >
                    <TbEye className="size-4" aria-hidden="true" />
                    Detail
                </Link>
                <Button
                    variant="secondary"
                    className="min-h-10 gap-1 px-2 text-xs"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                >
                    <TbEdit className="size-4" aria-hidden="true" />
                    Edit
                </Button>
                <Button
                    variant="subtleDanger"
                    className="min-h-10 gap-1 px-2 text-xs"
                    onClick={() => onDelete(product)}
                    aria-label={`Hapus ${product.name}`}
                >
                    <TbTrash className="size-4" aria-hidden="true" />
                    Hapus
                </Button>
            </div>
        </article>
    )
}
