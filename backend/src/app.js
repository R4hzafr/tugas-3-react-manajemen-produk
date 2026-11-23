import express from "express"
import { createDatabase } from "./database.js"

const DEFAULT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

function validateProduct(input) {
    const name = typeof input?.name === "string" ? input.name.trim() : ""
    const price = typeof input?.price === "string" && input.price.trim() !== ""
        ? Number(input.price)
        : input?.price

    if (!name) {
        return { error: "Nama produk wajib diisi." }
    }
    if (name.length > 100) {
        return { error: "Nama produk maksimal 100 karakter." }
    }
    if (!Number.isSafeInteger(price) || price <= 0) {
        return { error: "Harga harus berupa bilangan bulat lebih dari 0." }
    }

    return { value: { name, price } }
}

function parseId(value) {
    const id = Number(value)
    return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function createApp({ db = createDatabase(), allowedOrigins = DEFAULT_ORIGINS } = {}) {
    const app = express()
    const origins = new Set(allowedOrigins)

    app.disable("x-powered-by")
    app.use((req, res, next) => {
        const origin = req.headers.origin
        if (!origin || origins.has(origin)) {
            if (origin) res.setHeader("Access-Control-Allow-Origin", origin)
            res.setHeader("Vary", "Origin")
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept")
        }
        if (req.method === "OPTIONS") return res.sendStatus(204)
        next()
    })
    app.use(express.json({ limit: "100kb" }))

    app.get("/api/health", (_req, res) => {
        res.json({ status: "ok", message: "Backend Manajemen Produk berjalan." })
    })

    app.get("/api/products", (req, res) => {
        const query = typeof req.query.q === "string" ? req.query.q.trim() : ""
        const rows = query
            ? db.prepare("SELECT id, name, price FROM products WHERE name LIKE ? COLLATE NOCASE ORDER BY id ASC").all(`%${query}%`)
            : db.prepare("SELECT id, name, price FROM products ORDER BY id ASC").all()
        res.json(rows)
    })

    app.get("/api/products/:id", (req, res) => {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: "ID produk tidak valid." })

        const product = db.prepare("SELECT id, name, price FROM products WHERE id = ?").get(id)
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan." })
        res.json(product)
    })

    app.post("/api/products", (req, res) => {
        const validation = validateProduct(req.body)
        if (validation.error) return res.status(400).json({ message: validation.error })

        const result = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)")
            .run(validation.value.name, validation.value.price)
        const product = db.prepare("SELECT id, name, price FROM products WHERE id = ?")
            .get(Number(result.lastInsertRowid))
        res.status(201).json(product)
    })

    app.put("/api/products/:id", (req, res) => {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: "ID produk tidak valid." })

        const validation = validateProduct(req.body)
        if (validation.error) return res.status(400).json({ message: validation.error })

        const result = db.prepare(`
            UPDATE products
            SET name = ?, price = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(validation.value.name, validation.value.price, id)

        if (Number(result.changes) === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan." })
        }

        const product = db.prepare("SELECT id, name, price FROM products WHERE id = ?").get(id)
        res.json(product)
    })

    app.delete("/api/products/:id", (req, res) => {
        const id = parseId(req.params.id)
        if (!id) return res.status(400).json({ message: "ID produk tidak valid." })

        const result = db.prepare("DELETE FROM products WHERE id = ?").run(id)
        if (Number(result.changes) === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan." })
        }
        res.status(204).end()
    })

    app.use((req, res) => {
        res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.` })
    })

    app.use((error, _req, res, _next) => {
        if (error instanceof SyntaxError && "body" in error) {
            return res.status(400).json({ message: "Format JSON yang dikirim tidak valid." })
        }
        console.error(error)
        res.status(500).json({ message: "Terjadi kesalahan pada server." })
    })

    return { app, db }
}
