import { useState } from "react";

function ProductModal({ mode, product, onClose, onSubmit, onDelete }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(
    product ? String(product.price) : ""
  );

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      price: Number(price)
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        {mode === "delete" ? (
          <>
            <div className="modal-icon">!</div>
            <h2>Hapus Produk?</h2>
            <p className="modal-description">
              Apakah kamu yakin ingin menghapus produk {product.name}?
            </p>

            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose}>
                Batal
              </button>
              <button
                className="confirm-delete-button"
                onClick={() => onDelete(product.id)}
              >
                Ya, Hapus
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <span className="modal-label">MANAJEMEN PRODUK</span>
                <h2>{mode === "add" ? "Tambah Produk" : "Edit Produk"}</h2>
                <p className="modal-description">
                  Lengkapi informasi produk di bawah ini.
                </p>
              </div>

              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="product-name">Nama Produk</label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Contoh: Pulpen"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-price">Harga (Rp)</label>
                <input
                  id="product-price"
                  type="number"
                  min="1"
                  placeholder="Contoh: 5000"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                >
                  Batal
                </button>
                <button type="submit" className="save-button">
                  {mode === "add" ? "Simpan Produk" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductModal;
