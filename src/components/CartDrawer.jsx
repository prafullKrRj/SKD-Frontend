export default function CartDrawer({ open, onClose, items, subtotal, onSetQty, onCheckout }) {
  return (
    <>
      <div
        className={`drawer-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? 'open' : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">Your cart is empty.</div>
          ) : (
            items.map(it => (
              <div className="line" key={it.id}>
                <div>
                  <p className="line-name">{it.name}</p>
                  <p className="line-meta">₹{it.price} each</p>
                </div>
                <div className="qty" aria-label={`Quantity of ${it.name}`}>
                  <button
                    onClick={() => onSetQty(it.id, it.qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span aria-live="polite">{it.qty}</span>
                  <button
                    onClick={() => onSetQty(it.id, it.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>
            <button className="btn-primary" onClick={onCheckout}>
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  )
}