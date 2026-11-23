import { test } from "node:test"
import assert from "node:assert/strict"
import ProductModel from "../src/data/product/model/product-model.ts"
import ProductListParam from "../src/data/product/param/product-list-param.ts"
import ProductRemote from "../src/data/product/source/product-remote.ts"
import ProductRepository from "../src/data/product/repository/product-repository.ts"

const sample = { id: 1, name: " Pulpen ", price: 5000 }

test("model memetakan response API ke data produk", () => {
    const model = ProductModel.fromResponse({ ...sample, extra: "ignored" })
    assert.equal(model.getId(), 1)
    assert.equal(model.getName(), "Pulpen")
    assert.equal(model.getPrice(), 5000)
    assert.deepEqual(model.toJSON(), { id: 1, name: "Pulpen", price: 5000 })
})

test("model menerima ID dan harga numerik dari database", () => {
    const model = ProductModel.fromResponse({ id: "7", name: "Buku", price: "12000" })
    assert.deepEqual(model.toJSON(), { id: 7, name: "Buku", price: 12000 })
})

test("model menolak response produk yang tidak valid", () => {
    for (const data of [
        null,
        {},
        { ...sample, id: 0 },
        { ...sample, name: " " },
        { ...sample, price: "bukan angka" },
        { ...sample, price: -1 },
        { ...sample, price: 1.5 },
        { ...sample, price: Infinity },
    ]) {
        assert.throws(() => ProductModel.fromResponse(data), TypeError)
    }
})

test("parameter pencarian di-encode ke query string", () => {
    assert.equal(new ProductListParam().toQueryString(), "")
    const query = new ProductListParam({ query: " Buku & Pulpen " }).toQueryString()
    assert.equal(new URLSearchParams(query).get("q"), "Buku & Pulpen")
})

test("source mengirim GET daftar dan detail ke endpoint yang benar", async () => {
    const urls: string[] = []
    const source = ProductRemote({
        baseUrl: "https://api.example.test/api/",
        fetchImpl: async (url, options) => {
            urls.push(`${(url as URL).href} ${options?.method}`)
            return Response.json(sample)
        },
    })

    await source.getProductListRemote(new ProductListParam({ query: "pul" }))
    await source.getProductRemote(1)
    assert.deepEqual(urls, [
        "https://api.example.test/api/products?q=pul GET",
        "https://api.example.test/api/products/1 GET",
    ])
})

test("source mengirim POST, PUT, dan DELETE dengan payload yang benar", async () => {
    const calls: { url: string; method: string; body: string | null }[] = []
    const source = ProductRemote({
        baseUrl: "https://api.example.test/api",
        fetchImpl: async (url, options) => {
            calls.push({
                url: (url as URL).href,
                method: String(options?.method),
                body: typeof options?.body === "string" ? options.body : null,
            })
            if (options?.method === "DELETE") return new Response(null, { status: 204 })
            return Response.json(sample)
        },
    })

    const values = { name: "Pulpen", price: 5000 }
    await source.createProductRemote(values)
    await source.updateProductRemote(1, { name: "Pulpen Biru", price: 6000 })
    await source.deleteProductRemote(1)

    assert.deepEqual(calls, [
        {
            url: "https://api.example.test/api/products",
            method: "POST",
            body: JSON.stringify(values),
        },
        {
            url: "https://api.example.test/api/products/1",
            method: "PUT",
            body: JSON.stringify({ name: "Pulpen Biru", price: 6000 }),
        },
        {
            url: "https://api.example.test/api/products/1",
            method: "DELETE",
            body: null,
        },
    ])
})

test("repository menerima array langsung dan wrapper data", async () => {
    const direct = ProductRepository({
        getProductListRemote: async () => [sample],
        getProductRemote: async () => sample,
        createProductRemote: async () => sample,
        updateProductRemote: async () => sample,
        deleteProductRemote: async () => null,
    })
    assert.equal((await direct.getProductList())[0].getName(), "Pulpen")
    assert.equal((await direct.getProductById(1)).getId(), 1)
    assert.equal((await direct.createProduct({ name: "Pulpen", price: 5000 }))?.getId(), 1)
    assert.equal((await direct.updateProduct(1, { name: "Pulpen", price: 5000 }))?.getId(), 1)
    await direct.deleteProduct(1)

    const wrapped = ProductRepository({
        getProductListRemote: async () => ({ data: [sample] }),
        getProductRemote: async () => ({ data: sample }),
        createProductRemote: async () => null,
        updateProductRemote: async () => null,
        deleteProductRemote: async () => null,
    })
    assert.equal((await wrapped.getProductList()).length, 1)
    assert.equal((await wrapped.getProductById(1)).getName(), "Pulpen")
    assert.equal(await wrapped.createProduct({ name: "Pulpen", price: 5000 }), null)
})

test("repository menolak response list dengan ID duplikat atau bentuk tidak valid", async () => {
    for (const response of [[sample, sample], { wrong: [sample] }]) {
        const repository = ProductRepository({
            getProductListRemote: async () => response,
            getProductRemote: async () => sample,
            createProductRemote: async () => sample,
            updateProductRemote: async () => sample,
            deleteProductRemote: async () => null,
        })
        await assert.rejects(repository.getProductList(), TypeError)
    }
})

test("source menolak URL kosong dan HTTP error", async () => {
    let called = false
    const noUrl = ProductRemote({
        fetchImpl: async () => {
            called = true
            return Response.json([])
        },
    })
    await assert.rejects(noUrl.getProductListRemote(), /VITE_API_BASE_URL/)
    assert.equal(called, false)

    const failed = ProductRemote({
        baseUrl: "https://api.example.test/api",
        fetchImpl: async () => new Response("error", { status: 500 }),
    })
    await assert.rejects(failed.getProductListRemote(), /HTTP 500/)
})
