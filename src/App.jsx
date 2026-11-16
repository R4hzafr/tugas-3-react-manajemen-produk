import { useState } from "react";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import "./App.css";

const initialProducts = [
  { id: 1, name: "Pulpen", price: 5000 },
  { id: 2, name: "Buku Tulis", price: 12000 },
  { id: 3, name: "Spidol", price: 8000 },
  { id: 4, name: "Penggaris", price: 6000 },
  { id: 5, name: "Penghapus", price: 3000 }
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSaveProduct(data) {
    if (modal.type === "add") {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), ...data }
      ]);
    } else {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === modal.product.id
            ? { ...product, ...data }
            : product
        )
      );
    }

    setModal(null);
  }

  function handleDeleteProduct(id) {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setModal(null);
  }

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">MP</div>
          <div>
            <h1>Manajemen Produk</h1>
            <p>Product Management System</p>
          </div>
        </div>
        <span className="topbar-label">ADMINISTRASI PRODUK</span>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <div>
            <span className="section-label">DASHBOARD</span>
            <h2>Kelola Produk Anda</h2>
            <p>Kelola daftar produk dan harga dalam satu tempat.</p>
          </div>

          <button
            className="add-button"
            onClick={() => setModal({ type: "add" })}
          >
            <span>+</span> Tambah Produk
          </button>
        </section>

        <section className="product-section">
          <div className="section-heading">
            <div>
              <h2>Daftar Produk</h2>
              <p>Kelola seluruh produk yang tersedia.</p>
            </div>

            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="product-summary">
            Menampilkan <strong>{filteredProducts.length}</strong> dari{" "}
            <strong>{products.length}</strong> produk
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onEdit={(item) =>
                    setModal({ type: "edit", product: item })
                  }
                  onDelete={(item) =>
                    setModal({ type: "delete", product: item })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Produk tidak ditemukan</h3>
              <p>Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </section>

        <footer className="footer">
          <p>Manajemen Produk · Fundamental React</p>
          <p>© 2026</p>
        </footer>
      </main>

      {modal && (
        <ProductModal
          key={modal.type + "-" + (modal.product?.id || "new")}
          mode={modal.type}
          product={modal.product}
          onClose={() => setModal(null)}
          onSubmit={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}

export default App;
