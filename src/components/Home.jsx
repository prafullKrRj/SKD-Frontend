import { useEffect, useRef, useState } from 'react'
import { RESTAURANT as R } from '../data/restaurant.js'

// Reveal-on-scroll: adds .in when element enters viewport.
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]') ?? []
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

const FLOAT = ['🥟', '🍜', '🍔', '🍟', '🥔', '🌶️', '🧀', '🥢']

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4m6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44"
      />
    </svg>
  )
}

export default function Home({ onOrder }) {
  const ref = useReveal()
  const heroBtnRef = useRef(null)
  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const telHref = 'tel:' + R.phone.replace(/\s+/g, '')

  useEffect(() => {
    const el = heroBtnRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShowFloatingBar(!entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <main className="home" ref={ref}>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="grain" />

        {/* floating food emoji */}
        <div className="floaters" aria-hidden="true">
          {FLOAT.map((e, i) => (
            <span key={i} className={`floater f${i}`}>
              {e}
            </span>
          ))}
        </div>

        <div className="hero-inner">
          <img src="/logo.png" alt={R.name} className="hero-logo" />
          <span className="hero-badge">📍 {R.location}</span>
          <h1 className="hero-title">
            <span className="line l1">Swad</span>
            <span className="line l2">Ki Dukaan</span>
          </h1>
          <p className="hero-tagline">{R.tagline}</p>
          <div className="hero-actions">
            <button className="btn-glow" ref={heroBtnRef} onClick={onOrder}>
              Order Now <span className="arrow">→</span>
            </button>
            <a className="btn-outline" href={R.instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="ig-icon" />
              Follow us
            </a>
          </div>
          <p className="hero-hours">{R.hours}</p>
        </div>

        {/* scrolling dish marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...R.variety, ...R.variety].map((v, i) => (
              <span className="marquee-item" key={i}>
                {v.emoji} {v.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="home-body">
        {/* ---------- ABOUT ---------- */}
        <section className="home-section" data-reveal>
          <span className="eyebrow">Our Story</span>
          <h2 className="home-h2">Ghar jaisa swad, every single bite.</h2>
          <p className="home-about">{R.about}</p>
          <p className="home-owner">— {R.owner}</p>
        </section>

        {/* ---------- FOOD VARIETY ---------- */}
        <section className="home-section" data-reveal>
          <span className="eyebrow">The Menu</span>
          <h2 className="home-h2">What we cook fresh</h2>
          <div className="variety-grid">
            {R.variety.map((v, i) => (
              <div className={`variety-card v${i % 6}`} key={v.label}>
                <span className="variety-emoji">{v.emoji}</span>
                <span className="variety-label">{v.label}</span>
                <span className="variety-note">{v.note}</span>
              </div>
            ))}
          </div>
          <button className="btn-glow sm" onClick={onOrder}>
            See full menu →
          </button>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section className="home-section" data-reveal>
          <span className="eyebrow">Find Us</span>
          <h2 className="home-h2">Come say hello</h2>
          <div className="contact-grid">
            <a className="contact-card" href={telHref}>
              <span className="contact-icon">📞</span>
              <span className="contact-k">Call us</span>
              <span className="contact-v">{R.phone}</span>
            </a>
            <a className="contact-card ig-card" href={R.instagram} target="_blank" rel="noopener noreferrer">
              <span className="contact-icon"><InstagramIcon className="ig-icon-lg" /></span>
              <span className="contact-k">Instagram</span>
              <span className="contact-v">{R.instagramHandle}</span>
            </a>
            <div className="contact-card">
              <span className="contact-icon">📍</span>
              <span className="contact-k">Location</span>
              <span className="contact-v">{R.location}</span>
            </div>
          </div>
        </section>

        <footer className="home-foot">
          <img src="/logo.png" alt={R.name} />
          <p>{R.name} · {R.location}</p>
        </footer>
      </div>

      {/* ---------- STICKY ORDER BAR ---------- */}
      <button
        className={`home-order-bar${showFloatingBar ? ' visible' : ''}`}
        onClick={onOrder}
      >
        <span className="hob-emoji">🥟</span>
        <span>Order Now</span>
        <span className="hob-arrow">→</span>
      </button>
    </main>
  )
}
