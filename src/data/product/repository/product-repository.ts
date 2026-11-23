import type { ProductRemoteSource } from "../source/product-remote.ts"
import type { ProductValues } from "../../../types/product"
import ProductModel from "../model/product-model.ts"
import ProductListParam from "../param/product-list-param.ts"

// Repository menjadi penghubung antara response backend dan model aplikasi.
export default function ProductRepository(source: ProductRemoteSource) {
    function unwrapSingle(response: unknown): unknown {
        if (typeof response !== "object" || response === null) return response
        const record = response as Record<string, unknown>
        if ("data" in record) return record.data
        if ("product" in record) return record.product
        return response
    }

    function unwrapList(response: unknown): unknown[] {
        if (Array.isArray(response)) return response
        if (typeof response === "object" && response !== null) {
            const record = response as Record<string, unknown>
            if (Array.isArray(record.data)) return record.data
            if (Array.isArray(record.products)) return record.products
        }
        throw new TypeError(
            "Format daftar produk tidak valid. API harus mengembalikan array produk atau { data: [...] }.",
        )
    }

    function validateUniqueIds(products: ProductModel[]): ProductModel[] {
        const ids = products.map((product) => product.getId())
        if (new Set(ids).size !== ids.length) {
            throw new TypeError("ID produk dari API harus unik.")
        }
        return products
    }

    async function getProductList(
        param = new ProductListParam(),
    ): Promise<ProductModel[]> {
        const response = await source.getProductListRemote(param)
        const products = unwrapList(response).map((item) =>
            ProductModel.fromResponse(item),
        )
        return validateUniqueIds(products)
    }

    async function getProductById(id: number): Promise<ProductModel> {
        const response = await source.getProductRemote(id)
        return ProductModel.fromResponse(unwrapSingle(response))
    }

    async function createProduct(values: ProductValues): Promise<ProductModel | null> {
        const response = await source.createProductRemote(values)
        if (response === null) return null
        return ProductModel.fromResponse(unwrapSingle(response))
    }

    async function updateProduct(
        id: number,
        values: ProductValues,
    ): Promise<ProductModel | null> {
        const response = await source.updateProductRemote(id, values)
        if (response === null) return null
        return ProductModel.fromResponse(unwrapSingle(response))
    }

    async function deleteProduct(id: number): Promise<void> {
        await source.deleteProductRemote(id)
    }

    return {
        getProductList,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}

export type ProductRepositoryType = ReturnType<typeof ProductRepository>
