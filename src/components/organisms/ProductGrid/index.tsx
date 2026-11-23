import type { Product } from "../../../types/product"
import ProductCard from "../../molecules/ProductCard"

type Props = {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (product: Product) => void
}

export default function ProductGrid({ products, onEdit, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
