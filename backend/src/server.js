import "dotenv/config"
import { createServer } from "node:http"
import { createApp } from "./app.js"

const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || "127.0.0.1"
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

const { app, db } = createApp({ allowedOrigins })
const server = createServer(app)

server.listen(port, host, () => {
    console.log(`Backend aktif: http://${host}:${port}`)
    console.log(`Health check: http://${host}:${port}/api/health`)
    console.log(`API produk: http://${host}:${port}/api/products`)
})

function shutdown() {
    server.close(() => {
        db.close()
        process.exit(0)
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
