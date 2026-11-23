import type { Product } from "../../../types/product"

// Memvalidasi response backend sebelum data dipakai oleh antarmuka.
export default class ProductModel {
    private readonly id: number
    private readonly name: string
    private readonly price: number

    constructor({ id, name, price }: Product) {
        this.id = id
        this.name = name
        this.price = price
    }

    getId(): number {
        return this.id
    }

    getName(): string {
        return this.name
    }

    getPrice(): number {
        return this.price
    }

    toJSON(): Product {
        return { id: this.id, name: this.name, price: this.price }
    }

    static fromResponse(data: unknown): ProductModel {
        if (typeof data !== "object" || data === null) {
            throw new TypeError("Format produk dari API tidak valid.")
        }

        const record = data as Record<string, unknown>
        const id = typeof record.id === "string" ? Number(record.id) : record.id
        const price =
            typeof record.price === "string"
                ? Number(record.price)
                : record.price

        if (
            typeof id !== "number" ||
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            typeof record.name !== "string" ||
            !record.name.trim() ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            !Number.isInteger(price) ||
            price <= 0
        ) {
            throw new TypeError("Format produk dari API tidak valid.")
        }

        return new ProductModel({
            id,
            name: record.name.trim(),
            price,
        })
    }
}
