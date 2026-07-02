export default function TopBar({ cartCount, onCartClick, onLogoClick }) {
  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={onLogoClick}
        aria-label="Swad Ki Dukaan home"
      >
        <img src="/logo.png" alt="Swad Ki Dukaan" className="brand-logo" />
        <span className="brand-wordmark">Swad Ki Dukaan</span>
      </button>
      <button
        className="cart-btn"
        onClick={onCartClick}
        aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
      >
        <span>Cart</span>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>
    </header>
  )
}
