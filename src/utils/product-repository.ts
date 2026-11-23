import ProductRemote from "../data/product/source/product-remote.ts"
import ProductRepository from "../data/product/repository/product-repository.ts"

const productRemote = ProductRemote({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
})

const productRepository = ProductRepository(productRemote)

export default productRepository
