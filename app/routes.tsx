import { Navigate, Route, Routes } from "react-router"
import DashboardPage from "../src/components/pages/DashboardPage"
import NotFoundPage from "../src/components/pages/NotFoundPage"
import ProductDetailPage from "../src/components/pages/ProductDetailPage"
import ProductsPage from "./products/page"
import PageLayout from "../src/components/templates/PageLayout"

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
