import { useEffect, useMemo, useState } from 'react'
import { MENU as FALLBACK_MENU } from '../data/menu.js'
import { getMenu } from '../api.js'

export default function Menu({ cart, onAdd, onSetQty }) {
  const [cat, setCat] = useState('All')
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let alive = true
    getMenu()
      .then(items => {
        if (!alive) return
        // Fall back to bundled sample data if Firestore menu is empty.
        setMenu(items.length ? items : FALLBACK_MENU)
        setOffline(items.length === 0)
      })
      .catch(() => {
        if (!alive) return
        setMenu(FALLBACK_MENU)
        setOffline(true)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menu.map(d => d.category)))],
    [menu]
  )
  const items = cat === 'All' ? menu : menu.filter(d => d.category === cat)

  return (
    <main className="container">
      <h1 className="page-title">Our menu</h1>
      <p className="page-sub">Home-style flavours, made fresh today.</p>
      {offline && (
        <p className="page-sub" style={{ color: 'var(--orange)' }}>
          Showing sample menu — live menu unavailable.
        </p>
      )}

      {loading ? (
        <p className="page-sub">Loading menu…</p>
      ) : (
        <>
          <div className="category-tabs" role="tablist" aria-label="Dish categories">
            {categories.map(c => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`cat-btn ${cat === c ? 'active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {items.map(d => (
              <article className="dish-card" key={d.id}>
                <span className="veg-dot" aria-label="Pure veg" title="Pure veg" />
                <h3 className="dish-name">{d.name}</h3>
                <p className="dish-desc">{d.description}</p>
                <div className="dish-footer">
                  <span className="dish-price">₹{d.price}</span>
                  {cart?.[d.id]?.qty > 0 ? (
                    <div className="qty-stepper" aria-label={`${d.name} quantity`}>
                      <button
                        className="qty-btn"
                        onClick={() => onSetQty(d.id, cart[d.id].qty - 1)}
                        aria-label={`Remove one ${d.name}`}
                      >
                        −
                      </button>
                      <span className="qty-count">{cart[d.id].qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onAdd(d)}
                        aria-label={`Add one more ${d.name}`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-btn"
                      onClick={() => onAdd(d)}
                      aria-label={`Add ${d.name} to cart`}
                    >
                      Add
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
