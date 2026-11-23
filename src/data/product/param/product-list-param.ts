// Menyusun parameter pencarian untuk endpoint daftar produk.
export default class ProductListParam {
    private readonly query: string

    constructor({ query = "" }: { query?: string } = {}) {
        this.query = query.trim()
    }

    toQueryString(): string {
        const params = new URLSearchParams()
        if (this.query) params.set("q", this.query)
        return params.toString()
    }
}
