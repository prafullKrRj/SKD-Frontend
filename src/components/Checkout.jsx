import { useState } from 'react'
import { sendOtp } from '../api.js'

export default function Checkout({ cartItems, subtotal, onBack, onSent }) {
  const [phone, setPhone] = useState('') // 10 digits only, +91 is fixed
  const [flat, setFlat] = useState('')
  const [area, setArea] = useState('')
  const [village, setVillage] = useState('')
  const [landmark, setLandmark] = useState('')
  const [coords, setCoords] = useState(null)
  const [locConfirmed, setLocConfirmed] = useState(false)
  const [locating, setLocating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function onPhoneChange(e) {
    // keep digits only, cap at 10
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(digits)
  }

  // "98765 43210" for readability
  const phoneDisplay = phone.replace(/(\d{5})(\d{1,5})/, '$1 $2')

  function captureLocation() {
    setError('')
    if (!navigator.geolocation) {
      setError('Location not supported on this device.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setLocating(false)
      },
      err => {
        setLocating(false)
        setError(`Could not get location: ${err.message}`)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function buildAddress() {
    return [flat.trim(), area.trim(), village.trim(), landmark.trim() && `Near ${landmark.trim()}`]
      .filter(Boolean)
      .join(', ')
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    setError('')

    if (phone.length !== 10) {
      setError('Enter your 10-digit mobile number.')
      return
    }
    if (flat.trim().length < 2 || area.trim().length < 3) {
      setError('Add your house/flat and area so we can find you.')
      return
    }
    if (!coords) {
      setError('Tap "Use my location" so we can confirm delivery area.')
      return
    }

    const fullPhone = '+91' + phone
    const address = buildAddress()

    setBusy(true)
    try {
      await sendOtp({
        phone_number: fullPhone,
        cart_items: cartItems.map(i => ({
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        delivery_address: address,
        latitude: coords.latitude,
        longitude: coords.longitude,
        location_confirmed: locConfirmed,
      })
      onSent({
        phone_number: fullPhone,
        cart_items: cartItems,
        delivery_address: address,
        latitude: coords.latitude,
        longitude: coords.longitude,
        location_confirmed: locConfirmed,
        subtotal,
      })
    } catch (err) {
      if (err.status === 429) {
        setError('Too many attempts, wait a minute.')
      } else {
        setError(err.message || 'Could not send OTP. Try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container">
      <h1 className="page-title">Checkout</h1>
      <p className="page-sub">Tell us where to deliver and we'll text you a code.</p>

      <div className="checkout-grid">
        <form className="form-card" onSubmit={handleSendOtp} noValidate>
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="form-row">
            <label htmlFor="phone">Mobile number</label>
            <div className="phone-field">
              <span className="phone-prefix">+91</span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
                value={phoneDisplay}
                onChange={onPhoneChange}
                maxLength={11}
                required
              />
              {phone.length === 10 && <span className="phone-ok">✓</span>}
            </div>
            <p className="field-hint">We'll send an OTP to verify this number.</p>
          </div>

          <fieldset className="addr-fieldset">
            <legend>Delivery address</legend>

            <div className="form-row">
              <label htmlFor="flat">House / Flat / Shop no.</label>
              <input
                id="flat"
                type="text"
                autoComplete="address-line1"
                placeholder="e.g. House 12, 2nd floor"
                value={flat}
                onChange={e => setFlat(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="area">Area / Street / Colony</label>
              <input
                id="area"
                type="text"
                autoComplete="address-line2"
                placeholder="e.g. Basi Kiratpur"
                value={area}
                onChange={e => setArea(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="village">
                Village <span className="opt">(optional)</span>
              </label>
              <input
                id="village"
                type="text"
                autoComplete="address-level3"
                placeholder="e.g. Basi"
                value={village}
                onChange={e => setVillage(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label htmlFor="landmark">
                Landmark <span className="opt">(optional)</span>
              </label>
              <input
                id="landmark"
                type="text"
                placeholder="e.g. Hindu Inter College"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
              />
            </div>

            <div className="form-row" style={{ marginBottom: 0 }}>
              <label>Pin your location <span className="opt">(required)</span></label>
              <div className="loc-row">
                <button
                  type="button"
                  className={`loc-btn ${coords ? 'done' : ''}`}
                  onClick={captureLocation}
                  disabled={locating}
                >
                  {locating
                    ? 'Locating…'
                    : coords
                      ? '✓ Location pinned'
                      : '📍 Use my location'}
                </button>
                {coords && (
                  <span className="coords">
                    {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                  </span>
                )}
              </div>
              <label className="loc-confirm" style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', fontWeight: 400 }}>
                <input
                  type="checkbox"
                  checked={locConfirmed}
                  onChange={e => setLocConfirmed(e.target.checked)}
                />
                <span>My pinned location is the same as my delivery address (helps the rider navigate).</span>
              </label>
            </div>
          </fieldset>

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Sending OTP…' : 'Send OTP'}
          </button>

          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn-link" onClick={onBack}>
              ← Back to menu
            </button>
          </div>
        </form>

        <aside className="checkout-summary" aria-label="Order summary">
          <h3>Order summary</h3>
          {cartItems.map(it => (
            <div className="line" key={it.id}>
              <div>
                <p className="line-name">{it.name}</p>
                <p className="line-meta">₹{it.price} × {it.qty}</p>
              </div>
              <span className="line-amount">₹{it.price * it.qty}</span>
            </div>
          ))}
          <div className="subtotal-row" style={{ marginTop: 14 }}>
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>
        </aside>
      </div>
    </main>
  )
}
