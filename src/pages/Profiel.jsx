import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'

const groen = '#00A99D'
const groenDark = '#1A3080'

const naamNetjes = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

const disciplineNaarModule = {
  'Programmeur / curator / artiest / educator': 1,
  'Communicatie / social media / ticketing / publieksservice': 2,
  'HR / leidinggevende / coördinator': 3,
  'Productie / facilitair / techniek / planning': 4,
  'Anders / meerdere rollen': 1,
}

function Profiel() {
  const [user] = useAuthState(auth)
  const [stap, setStap] = useState(1)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', discipline: '', kennisNiveauStart: 5 })
  const [laden, setLaden] = useState(false)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (user === null) navigate('/login')
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.discipline) return
    setLaden(true)
    const eersteModule = disciplineNaarModule[form.discipline] || 1
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, {
      naam: naamNetjes(form.naam),
      achternaam: naamNetjes(form.achternaam),
      organisatie: form.organisatie,
      discipline: form.discipline,
      rol: form.discipline,
      kennisNiveauStart: parseInt(form.kennisNiveauStart),
      eersteModule,
      voortgang: {},
      modulesUnlocked: [eersteModule],
      allUnlocked: false,
    }, { merge: true })
    navigate('/basiskennis/1')
  }

  const stap1Klaar = form.naam && form.achternaam && form.organisatie && form.discipline

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', display: 'flex',
      alignItems: isMobiel ? 'flex-start' : 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', padding: isMobiel ? 0 : '2rem',
      background: groenDark, overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18, zIndex: 0 }} />

      <div style={{
        position: 'relative', zIndex: 1, background: 'white',
        borderRadius: isMobiel ? '0' : '16px',
        padding: isMobiel ? '2rem 1.5rem' : '3rem',
        maxWidth: '580px', width: '100%',
        boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)',
        minHeight: isMobiel ? '100vh' : 'auto',
      }}>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', marginTop: isMobiel ? '2rem' : 0 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ height: '3px', flex: 1, borderRadius: '2px', background: s <= stap ? groen : '#e0e0e0', transition: 'background 0.3s' }} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* STAP 1: Naam + discipline */}
          {stap === 1 && (
            <>
              <h1 style={{ margin: '0 0 0.4rem', color: '#1a1a1a', fontSize: '1.5rem' }}>Vertel ons iets over jezelf</h1>
              <p style={{ color: '#555', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Zo weten wij wie de Boost doet, en kun jij straks de voorbeelden kiezen die bij jouw werk passen.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam *</label>
                  <input name="naam" value={form.naam} onChange={handleChange} required placeholder="Voornaam"
                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = groen}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam *</label>
                  <input name="achternaam" value={form.achternaam} onChange={handleChange} required placeholder="Achternaam"
                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = groen}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie *</label>
                <input name="organisatie" value={form.organisatie} onChange={handleChange} required placeholder="Naam van je organisatie"
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'} />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Jouw discipline / vakgebied *</label>
                <select name="discipline" value={form.discipline} onChange={handleChange} required
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', background: 'white', fontFamily: 'system-ui' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}>
                  <option value="">— Kies je discipline —</option>
                  {Object.keys(disciplineNaarModule).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={() => stap1Klaar && setStap(2)} disabled={!stap1Klaar}
                style={{ width: '100%', padding: '0.9rem', background: stap1Klaar ? groen : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: stap1Klaar ? 'pointer' : 'default' }}>
                Volgende →
              </button>
            </>
          )}

          {/* STAP 2: Kennis nulmeting */}
          {stap === 2 && (
            <>
              <h1 style={{ margin: '0 0 0.4rem', color: '#1a1a1a', fontSize: '1.5rem' }}>Waar sta je nu?</h1>
              <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.65' }}>
                Welk cijfer geef je jouw kennis over toegankelijkheid en inclusie? <strong>Geen toets, geen goed of fout — alleen een startpunt.</strong> Aan het eind kom je hierop terug en merk je je eigen groei.
              </p>

              <div style={{ background: '#f0fafa', borderRadius: '12px', padding: '1.75rem 1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#555' }}>Ik begin net</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: '700', color: groenDark }}>{form.kennisNiveauStart}</span>
                  <span style={{ fontSize: '0.82rem', color: '#555' }}>Ik ben expert</span>
                </div>
                <input type="range" min="1" max="10" value={form.kennisNiveauStart}
                  onChange={(e) => setForm({ ...form, kennisNiveauStart: e.target.value })}
                  style={{ width: '100%', accentColor: groen, cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginTop: '4px' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (<span key={n}>{n}</span>))}
                </div>
              </div>

              <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                Wat je invult gebruiken we alleen voor de Boost zelf. We delen het niet met anderen.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStap(1)}
                  style={{ flex: 1, padding: '0.9rem', background: 'white', color: '#1a1a1a', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  ← Terug
                </button>
                <button type="submit" disabled={laden}
                  style={{ flex: 2, padding: '0.9rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: laden ? 'default' : 'pointer' }}>
                  {laden ? 'Opslaan...' : 'Start de basis →'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profiel