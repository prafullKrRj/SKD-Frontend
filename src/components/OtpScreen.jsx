import { useState } from 'react'
import { verifyOtp } from '../api.js'

export default function OtpScreen({ orderData, onBack, onVerified }) {
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code we sent.')
      return
    }
    setBusy(true)
    try {
      const data = await verifyOtp({
        phone_number: orderData.phone_number,
        otp_entered: otp,
      })
      onVerified({
        ...orderData,
        ...data,
      })
    } catch (err) {
      if (err.status === 429) {
        setError('Too many attempts, wait a minute.')
      } else if (err.status === 400) {
        setError("That code didn't match. Try again.")
      } else {
        setError(err.message || 'Could not verify. Try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container">
      <div className="otp-wrap">
        <h1 className="page-title">Enter OTP</h1>
        <p className="otp-hint">
          We sent a 6-digit code to <strong>{orderData.phone_number}</strong>
        </p>

        {error && (
          <div className="error-banner" role="alert" style={{ width: '100%' }}>
            {error}
          </div>
        )}

        <form className="otp-form" onSubmit={handleVerify} noValidate>
          <input
            className="otp-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            autoFocus
            aria-label="One-time password"
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 20 }}
            disabled={busy || otp.length !== 6}
          >
            {busy ? 'Verifying…' : 'Verify'}
          </button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button type="button" className="btn-link" onClick={onBack}>
              ← Change number or address
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}