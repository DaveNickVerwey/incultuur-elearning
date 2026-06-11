import theaterFoto from '../assets/theater.jpg'
import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/InCultuur-community.webp'

const groen = '#00A99D'
const groenDark = '#1A3080'

function Login() {
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setFout('')
    try {
      const result = await signInWithEmailAndPassword(auth, email, wachtwoord)
      const uid = result.user.uid
      const ref = doc(db, 'gebruikers', uid)
      const snap = await getDoc(ref)
      if (!snap.exists() || !snap.data().naam) {
        navigate('/profiel')
      } else if (!snap.data().welkomGezien) {
        navigate('/welkom-intro')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setFout('E-mailadres of wachtwoord klopt niet.')
    }
  }

  if (isMobiel) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: groenDark, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ padding: '3rem 1.5rem 2rem' }}>
            <img src={logo} alt="InCultuur logo" style={{ height: '70px', width: 'auto', marginBottom: '1.5rem', objectFit: 'contain' }} />
            <p style={{ color: 'white', fontSize: '1.4rem', fontStyle: 'italic', fontWeight: '300', lineHeight: '1.4', marginBottom: '0.75rem' }}>
              "Cultuur is voor iedereen.<br />Leer hoe je dat waarmaakt."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Een praktische e-learning over toegankelijkheid voor cultuurprofessionals.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {['4 modules', '± 1 uur', 'Direct toepasbaar'].map((tag) => (
                <span key={tag} style={{ padding: '0.3rem 0.75rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', color: 'white', fontSize: '0.75rem' }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '2rem 1.5rem', flex: 1 }}>
            <h1 style={{ color: groenDark, fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Inloggen</h1>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Je ontving je inloggegevens via e-mail. Vul ze hieronder in om te beginnen.
            </p>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email-mob" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>E-mailadres</label>
                <input id="email-mob" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="wachtwoord-mob" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wachtwoord</label>
                <input id="wachtwoord-mob" type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} required
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              {fout && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' }}>{fout}</p>}
              <button type="submit" style={{ width: '100%', padding: '0.85rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                Inloggen →
              </button>
              <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem' }}>
                Inloggegevens kwijt? Neem contact op via<br />
                <a href="mailto:contact@incultuur.nl" style={{ color: groen }}>contact@incultuur.nl</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <div style={{ flex: 1, background: groenDark, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${groenDark}dd 0%, ${groenDark}bb 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'white', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: '300', lineHeight: '1.4', marginBottom: '1rem' }}>
            "Cultuur is voor iedereen.<br />Leer hoe je dat waarmaakt."
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Een praktische e-learning over toegankelijkheid voor cultuurprofessionals in Den Haag.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {['4 modules', '± 1 uur', 'Direct toepasbaar'].map((tag) => (
              <span key={tag} style={{ padding: '0.35rem 0.85rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', color: 'white', fontSize: '0.8rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', background: 'white' }}>
        <img src={logo} alt="InCultuur logo" style={{ height: '70px', width: 'auto', marginBottom: '2rem', objectFit: 'contain' }} />
        <h1 style={{ color: groenDark, fontSize: '1.75rem', margin: '0 0 0.5rem' }}>Inloggen</h1>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          Je ontving je inloggegevens via e-mail. Vul ze hieronder in om te beginnen.
        </p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>E-mailadres</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = groen}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="wachtwoord" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wachtwoord</label>
            <input id="wachtwoord" type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = groen}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          {fout && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem' }}>{fout}</p>}
          <button type="submit" style={{ width: '100%', padding: '0.85rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
            Inloggen →
          </button>
          <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem' }}>
            Inloggegevens kwijt? Neem contact op via<br />
            <a href="mailto:contact@incultuur.nl" style={{ color: groen }}>contact@incultuur.nl</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login