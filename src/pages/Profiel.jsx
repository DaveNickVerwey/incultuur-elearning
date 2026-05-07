import { useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const blauw = '#012c75'
const groen = '#039aa3'

const naamNetjes = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

function Profiel() {
  const [user] = useAuthState(auth)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', functie: '', verwachting: '', kennisniveau: 5 })
  const [laden, setLaden] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLaden(true)
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, {
      naam: naamNetjes(form.naam),
      achternaam: naamNetjes(form.achternaam),
      organisatie: form.organisatie,
      functie: form.functie,
      verwachting: form.verwachting,
      kennisniveau: form.kennisniveau,
      voortgang: {}
    }, { merge: true })
    navigate('/welkom')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', maxWidth: '520px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, color: blauw, fontSize: '1.5rem' }}>Welkom bij InCultuur</h1>
          <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '0.95rem' }}>Vul je gegevens in om te beginnen</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam</label>
              <input name="naam" value={form.naam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam</label>
              <input name="achternaam" value={form.achternaam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie</label>
            <input name="organisatie" value={form.organisatie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Functie</label>
            <input name="functie" value={form.functie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wat hoop je te leren?</label>
            <textarea name="verwachting" value={form.verwachting} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Mijn huidig kennisniveau over toegankelijkheid</label>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 0.75rem', fontStyle: 'italic' }}>Geef jezelf een cijfer van 1 (beginner) tot 10 (expert)</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>Beginner</span>
              <span style={{ fontWeight: 'bold', color: blauw, fontSize: '1.2rem' }}>{form.kennisniveau}/10</span>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>Expert</span>
            </div>
            <input type="range" min="1" max="10" value={form.kennisniveau} onChange={(e) => setForm({ ...form, kennisniveau: parseInt(e.target.value) })} style={{ width: '100%', accentColor: blauw }} />
          </div>

          <button type="submit" disabled={laden} style={{ width: '100%', padding: '0.85rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
            {laden ? 'Opslaan...' : 'Verder naar de e-learning'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profiel