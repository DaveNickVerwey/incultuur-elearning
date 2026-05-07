import theaterFoto from '../assets/theater.jpg'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

const blauw = '#012c75'
const groen = '#039aa3'

function Login() {
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setFout('')
    try {
      await signInWithEmailAndPassword(auth, email, wachtwoord)
      navigate('/dashboard')
    } catch (err) {
      setFout('E-mailadres of wachtwoord klopt niet.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* Linkerkant — sfeerbeeld */}
      <div style={{ flex: 1, background: blauw, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
       <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
<div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${blauw}dd 0%, ${blauw}bb 100%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'white', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: '300', lineHeight: '1.4', marginBottom: '1rem' }}>
            "Cultuur is voor iedereen.<br />Leer hoe je dat waarmaakt."
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Een praktische e-learning over toegankelijkheid voor cultuurprofessionals.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {['4 modules', '± 1 uur', 'Direct toepasbaar'].map((tag) => (
              <span key={tag} style={{ padding: '0.35rem 0.85rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', color: 'white', fontSize: '0.8rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rechterkant — loginformulier */}
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', background: 'white' }}>
        <img src={logo} alt="InCultuur logo" style={{ width: '120px', marginBottom: '2rem' }} />

        <h1 style={{ color: blauw, fontSize: '1.75rem', margin: '0 0 0.5rem' }}>Inloggen</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Je ontving je inloggegevens via e-mail. Vul ze hieronder in om te beginnen.
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wachtwoord</label>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          {fout && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{fout}</p>}

          <button
            type="submit"
            style={{ width: '100%', padding: '0.85rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Inloggen →
          </button>

          <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem' }}>
            Inloggegevens kwijt? Neem contact op via<br />
            <span style={{ color: groen }}>info@incultuur.nl</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login