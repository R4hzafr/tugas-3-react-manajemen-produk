import type { ProductValues } from "../../../types/product"
import ProductListParam from "../param/product-list-param.ts"

export type ProductRemoteSource = {
    getProductListRemote: (param?: ProductListParam) => Promise<unknown>
    getProductRemote: (id: number) => Promise<unknown>
    createProductRemote: (values: ProductValues) => Promise<unknown>
    updateProductRemote: (id: number, values: ProductValues) => Promise<unknown>
    deleteProductRemote: (id: number) => Promise<unknown>
}

type ProductRemoteOptions = {
    baseUrl?: string
    fetchImpl?: typeof fetch
}

// Seluruh komunikasi HTTP dipusatkan di source agar halaman tidak bergantung
// langsung pada detail endpoint backend.
export default function ProductRemote({
    baseUrl = "",
    fetchImpl = fetch,
}: ProductRemoteOptions = {}): ProductRemoteSource {
    function buildUrl(path = "", query = ""): URL {
        if (!baseUrl.trim()) {
            throw new Error(
                "Alamat backend belum diatur. Salin .env.example menjadi .env.local, lalu isi VITE_API_BASE_URL.",
            )
        }

        let url: URL
        try {
            const normalizedBase = baseUrl.replace(/\/+$/, "")
            url = new URL(`${normalizedBase}/products${path}`)
        } catch {
            throw new Error("VITE_API_BASE_URL bukan URL yang valid.")
        }

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("URL API harus menggunakan http atau https.")
        }
        if (query) url.search = query
        return url
    }

    async function request(
        url: URL,
        options: RequestInit = {},
    ): Promise<unknown> {
        const headers = new Headers(options.headers)
        headers.set("Accept", "application/json")
        if (options.body) headers.set("Content-Type", "application/json")

        const response = await fetchImpl(url, {
            ...options,
            headers,
        })

        if (!response.ok) {
            let detail = ""
            try {
                const payload: unknown = await response.json()
                if (typeof payload === "object" && payload !== null) {
                    const record = payload as Record<string, unknown>
                    if (typeof record.message === "string") detail = record.message
                    else if (typeof record.error === "string") detail = record.error
                }
            } catch {
                // Gunakan pesan HTTP jika backend tidak mengirim JSON.
            }
            throw new Error(
                detail || `Permintaan ke server gagal (HTTP ${response.status}).`,
            )
        }

        if (response.status === 204) return null
        const text = await response.text()
        return text ? JSON.parse(text) : null
    }

    async function getProductListRemote(
        param = new ProductListParam(),
    ): Promise<unknown> {
        return request(buildUrl("", param.toQueryString()), { method: "GET" })
    }

    async function getProductRemote(id: number): Promise<unknown> {
        return request(buildUrl(`/${encodeURIComponent(id)}`), {
            method: "GET",
        })
    }

    async function createProductRemote(values: ProductValues): Promise<unknown> {
        return request(buildUrl(), {
            method: "POST",
            body: JSON.stringify(values),
        })
    }

    async function updateProductRemote(
        id: number,
        values: ProductValues,
    ): Promise<unknown> {
        return request(buildUrl(`/${encodeURIComponent(id)}`), {
            method: "PUT",
            body: JSON.stringify(values),
        })
    }

    async function deleteProductRemote(id: number): Promise<unknown> {
        return request(buildUrl(`/${encodeURIComponent(id)}`), {
            method: "DELETE",
        })
    }

    return {
        getProductListRemote,
        getProductRemote,
        createProductRemote,
        updateProductRemote,
        deleteProductRemote,
    }
}
