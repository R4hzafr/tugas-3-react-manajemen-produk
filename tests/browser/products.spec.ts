import { test, expect } from "@playwright/test"

const apiBase = "http://127.0.0.1:3001/api"

test("dashboard dan navigasi responsif tampil pada desktop dan mobile", async ({ page }) => {
    for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto("/dashboard")
        await expect(page.getByRole("heading", { name: "Kelola Produk Anda" })).toBeVisible()
        await expect(page.getByRole("link", { name: /Buka Daftar Produk/ })).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
})

test("CRUD produk menggunakan endpoint backend", async ({ page }) => {
    let products = [{ id: 1, name: "Pulpen", price: 5000 }]

    await page.route(`${apiBase}/products**`, async (route) => {
        const request = route.request()
        const url = new URL(request.url())
        const method = request.method()
        const id = Number(url.pathname.split("/").pop())

        if (method === "GET" && url.pathname === "/api/products") {
            await route.fulfill({ json: products })
            return
        }
        if (method === "POST") {
            const body = request.postDataJSON() as { name: string; price: number }
            const created = { id: 2, ...body }
            products = [...products, created]
            await route.fulfill({ json: created, status: 201 })
            return
        }
        if (method === "PUT") {
            const body = request.postDataJSON() as { name: string; price: number }
            const updated = { id, ...body }
            products = products.map((product) => product.id === id ? updated : product)
            await route.fulfill({ json: updated })
            return
        }
        if (method === "DELETE") {
            products = products.filter((product) => product.id !== id)
            await route.fulfill({ status: 204 })
            return
        }
        await route.fulfill({ status: 404, json: { message: "Not found" } })
    })

    await page.goto("/products")
    await expect(page.getByRole("heading", { name: "Pulpen" })).toBeVisible()
    await page.getByRole("button", { name: "Tambah Produk" }).click()
    await page.getByLabel("Nama Produk").fill("Buku Gambar")
    await page.getByLabel("Harga (Rp)").fill("15000")
    await page.getByRole("button", { name: "Simpan Produk" }).click()
    await expect(page.getByRole("heading", { name: "Buku Gambar" })).toBeVisible()

    await page.getByRole("button", { name: "Edit Buku Gambar" }).click()
    await page.getByLabel("Nama Produk").fill("Buku Gambar A4")
    await page.getByLabel("Harga (Rp)").fill("18000")
    await page.getByRole("button", { name: "Simpan Perubahan" }).click()
    await expect(page.getByRole("heading", { name: "Buku Gambar A4" })).toBeVisible()

    await page.getByRole("button", { name: "Hapus Buku Gambar A4" }).click()
    await page.getByRole("button", { name: "Ya, Hapus Produk" }).click()
    await expect(page.getByRole("heading", { name: "Buku Gambar A4" })).toHaveCount(0)
})

test("halaman detail membaca ID dari URL dan menampilkan data produk", async ({ page }) => {
    await page.route(`${apiBase}/products/1`, (route) =>
        route.fulfill({ json: { id: 1, name: "Pulpen", price: 5000 } }),
    )
    await page.goto("/products/1")
    await expect(page.getByRole("heading", { name: "Pulpen" })).toBeVisible()
    await expect(page.getByText(/Rp\s*5\.000/)).toBeVisible()
    await page.getByRole("link", { name: /Kembali ke Daftar Produk/ }).click()
    await expect(page).toHaveURL(/\/products$/)
})

test("halaman 404 tampil untuk URL yang tidak terdaftar", async ({ page }) => {
    await page.goto("/alamat-tidak-ada")
    await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible()
    await page.getByRole("link", { name: /Kembali ke Dashboard/ }).click()
    await expect(page).toHaveURL(/\/dashboard$/)
})
