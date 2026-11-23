import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { DatabaseSync } from "node:sqlite"

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

export function createDatabase(databasePath = path.join(backendDirectory, "data", "products.db")) {
    if (databasePath !== ":memory:") {
        mkdirSync(path.dirname(databasePath), { recursive: true })
    }

    const db = new DatabaseSync(databasePath)
    db.exec(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL CHECK(length(trim(name)) > 0),
            price INTEGER NOT NULL CHECK(price > 0),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `)

    const row = db.prepare("SELECT COUNT(*) AS total FROM products").get()
    if (Number(row.total) === 0) {
        const insert = db.prepare("INSERT INTO products (name, price) VALUES (?, ?)")
        const seedProducts = [
            ["Pulpen", 5000],
            ["Buku Tulis", 12000],
            ["Spidol", 8000],
            ["Penggaris", 6000],
            ["Penghapus", 3000],
        ]
        db.exec("BEGIN")
        try {
            for (const [name, price] of seedProducts) insert.run(name, price)
            db.exec("COMMIT")
        } catch (error) {
            db.exec("ROLLBACK")
            throw error
        }
    }

    return db
}
