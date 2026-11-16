function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function ProductCard({ product, index, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <div className="product-card-top">
        <span className="product-number">
          #{String(index + 1).padStart(2, "0")}
        </span>
        <span className="product-status">Tersedia</span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>Harga produk</p>
        <h2>{formatRupiah(product.price)}</h2>
      </div>

      <div className="product-actions">
        <button className="edit-button" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(product)}>
          Hapus
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
