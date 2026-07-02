export default function Confirmation({ order, onRestart }) {
  const items = order.cart_items || []
  const subtotal =
    order.subtotal ?? items.reduce((s, i) => s + i.price * i.qty, 0)
  const orderId = order.order_id || order.id || 'pending'

  return (
    <main className="container">
      <div className="confirm">
        <div className="confirm-icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="page-title">Order placed</h1>
        <p className="page-sub">
          Your food is being prepared. We'll text you when it's on the way.
        </p>

        <div className="summary">
          <h3>Order #{orderId}</h3>
          <ul>
            {items.map((it, idx) => (
              <li key={idx}>
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
          <div className="subtotal-row" style={{ marginTop: 10 }}>
            <span>Total</span>
            <strong>₹{subtotal}</strong>
          </div>
        </div>

        <div className="summary">
          <h3>Delivering to</h3>
          <p className="summary-address">{order.delivery_address}</p>
          {order.latitude != null && order.longitude != null && (
            <p className="summary-coords">
              {order.latitude.toFixed(5)}, {order.longitude.toFixed(5)}
            </p>
          )}
        </div>

        <button className="btn-primary" onClick={onRestart}>
          Order again
        </button>
      </div>
    </main>
  )
}