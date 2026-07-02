import { useState, useMemo } from 'react'
import TopBar from './components/TopBar.jsx'
import Home from './components/Home.jsx'
import Menu from './components/Menu.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Checkout from './components/Checkout.jsx'
import OtpScreen from './components/OtpScreen.jsx'
import Confirmation from './components/Confirmation.jsx'

export default function App() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [step, setStep] = useState('home')
  const [orderData, setOrderData] = useState(null)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const cartItems = useMemo(
    () => Object.values(cart).filter(i => i.qty > 0),
    [cart]
  )
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  function addToCart(dish) {
    setCart(prev => {
      const existing = prev[dish.id]
      const qty = (existing?.qty || 0) + 1
      return { ...prev, [dish.id]: { ...dish, qty } }
    })
  }

  function setQty(id, qty) {
    setCart(prev => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = { ...next[id], qty }
      return next
    })
  }

  function goToCheckout() {
    setCartOpen(false)
    setStep('checkout')
  }

  function onOtpSent(data) {
    setOrderData(data)
    setStep('otp')
  }

  function onVerified(order) {
    setConfirmedOrder(order)
    setCart({})
    setStep('done')
  }

  function restart() {
    setStep('home')
    setOrderData(null)
    setConfirmedOrder(null)
  }

  return (
    <div className="app">
      {step !== 'home' && (
        <TopBar
          cartCount={cartCount}
          onCartClick={() => setCartOpen(true)}
          onLogoClick={step === 'done' ? restart : () => setStep('home')}
        />
      )}

      {step === 'home' && <Home onOrder={() => setStep('menu')} />}

      {step === 'menu' && (
        <Menu cart={cart} onAdd={addToCart} onSetQty={setQty} />
      )}

      {step === 'checkout' && (
        <Checkout
          cartItems={cartItems}
          subtotal={subtotal}
          onBack={() => setStep('menu')}
          onSent={onOtpSent}
        />
      )}

      {step === 'otp' && orderData && (
        <OtpScreen
          orderData={orderData}
          onBack={() => setStep('checkout')}
          onVerified={onVerified}
        />
      )}

      {step === 'done' && confirmedOrder && (
        <Confirmation order={confirmedOrder} onRestart={restart} />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        onSetQty={setQty}
        onCheckout={goToCheckout}
      />

      {cartCount > 0 && step === 'menu' && (
        <button className="floating-cart" onClick={() => setCartOpen(true)}>
          View cart · {cartCount} · ₹{subtotal}
        </button>
      )}
    </div>
  )
}