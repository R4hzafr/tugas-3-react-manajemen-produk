import { NavLink, Outlet } from "react-router"
import { TbLayoutDashboard, TbPackage } from "react-icons/tb"

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard },
    { to: "/products", label: "Daftar Produk", icon: TbPackage },
]

function NavigationLinks() {
    return (
        <>
            {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === "/dashboard"}
                    className={({ isActive }) =>
                        `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                            isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`
                    }
                >
                    <Icon className="size-5" aria-hidden="true" />
                    {label}
                </NavLink>
            ))}
        </>
    )
}

export default function PageLayout() {
    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-[0_2px_12px_rgba(30,58,112,0.04)] backdrop-blur">
                <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-xl bg-[#1e3a70] text-sm font-extrabold tracking-wide text-white shadow-sm">
                            MP
                        </div>
                        <div>
                            <p className="text-base leading-tight font-bold text-[#1e3a70] sm:text-lg">
                                Manajemen Produk
                            </p>
                            <p className="mt-1 text-[10px] font-semibold tracking-[1.4px] text-slate-400 sm:text-[11px]">
                                PRODUCT MANAGEMENT SYSTEM
                            </p>
                        </div>
                    </div>
                    <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[11px] font-bold tracking-[1.2px] text-blue-700 sm:flex">
                        ADMINISTRASI PRODUK
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]">
                <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] border-r border-slate-200 bg-white px-5 py-8 lg:block">
                    <p className="mb-4 px-4 text-[10px] font-extrabold tracking-[1.5px] text-slate-400">
                        MENU UTAMA
                    </p>
                    <nav className="flex flex-col gap-2">
                        <NavigationLinks />
                    </nav>
                    <div className="absolute right-5 bottom-7 left-5 rounded-2xl bg-[#f5f8ff] p-4">
                        <p className="text-xs font-bold text-[#1e3a70]">
                            Tugas 4 · React
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            React Router, Tailwind CSS, dan integrasi backend API.
                        </p>
                    </div>
                </aside>

                <div className="min-w-0">
                    <nav
                        aria-label="Navigasi utama"
                        className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden"
                    >
                        <NavigationLinks />
                    </nav>
                    <main className="min-h-[calc(100vh-150px)] min-w-0 px-4 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
                        <Outlet />
                    </main>
                    <footer className="mx-4 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:mx-8 sm:flex-row sm:items-center sm:justify-between lg:mx-10">
                        <p>Manajemen Produk · Pemrograman Web</p>
                        <p>© 2026 · Tugas 4</p>
                    </footer>
                </div>
            </div>
        </div>
    )
}
