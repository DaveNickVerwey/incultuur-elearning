import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'

const groen = '#00A99D'
const groenDark = '#1A3080'

const naamNetjes = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

const rolNaarModule = {
  'Programmeur / curator / artiest / educator': 1,
  'Communicatie / social media / ticketing / publieksservice': 2,
  'HR / leidinggevende / coördinator': 3,
  'Productie / facilitair / techniek / planning': 4,
  'Anders / meerdere rollen': 1,
}

function Profiel() {
  const [user] = useAuthState(auth)
  const [stap, setStap] = useState(1)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', functie: '', rol: '' })
  const [laden, setLaden] = useState(false)
  const isMobiel = window.innerWidth < 768
  const navigate = useNavigate()

  useEffect(() => {
    if (user === null) navigate('/login')
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rol) return
    setLaden(true)
    const eersteModule = rolNaarModule[form.rol] || 1
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, {
      naam: naamNetjes(form.naam),
      achternaam: naamNetjes(form.achternaam),
      organisatie: form.organisatie,
      functie: form.functie,
      rol: form.rol,
      eersteModule,
      voortgang: {},
      modulesUnlocked: [eersteModule],
      allUnlocked: false,
    }, { merge: true })
    navigate('/welkom-intro')
  }

  const stap1Klaar = form.naam && form.achternaam && form.organisatie && form.functie

  const moduleTitels = ['Makers van cultuur', 'Makers van bereik', 'Makers van samenwerking', 'Makers van mogelijkheden']
  const moduleKleuren = ['#E0F5F4', '#E8EFFE', '#EFEDFC', '#FDF0DC']
  const moduleTekstKleuren = [groenDark, groenDark, groenDark, '#7A4A05']

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: isMobiel ? 'flex-start' : 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: isMobiel ? 0 : '2rem',
      background: groenDark,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${theaterFoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'white',
        borderRadius: isMobiel ? '0' : '16px',
        padding: isMobiel ? '2rem 1.5rem' : '3rem',
        maxWidth: '560px',
        width: '100%',
        boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)',
        minHeight: isMobiel ? '100vh' : 'auto',
      }}>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', marginTop: isMobiel ? '2rem' : 0 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              height: '3px', flex: 1, borderRadius: '2px',
              background: s <= stap ? groen : '#e0e0e0',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {stap === 1 && (
            <>
              <h1 style={{ margin: '0 0 0.4rem', color: '#1a1a1a', fontSize: '1.5rem' }}>Vertel ons iets over jezelf</h1>
              <p style={{ color: '#555', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                We gebruiken dit om jouw leerervaring beter af te stemmen en bij te houden wie er deelneemt.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam *</label>
                  <input name="naam" value={form.naam} onChange={handleChange} required placeholder="Voornaam"
                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = groen}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam *</label>
                  <input name="achternaam" value={form.achternaam} onChange={handleChange} required placeholder="Achternaam"
                    style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = groen}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie *</label>
                <input name="organisatie" value={form.organisatie} onChange={handleChange} required placeholder="Naam van je organisatie"
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'} />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Functie *</label>
                <input name="functie" value={form.functie} onChange={handleChange} required placeholder="Jouw functietitel"
                  style={{ width: '100%', padding: '0.7rem', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'} />
              </div>

              <button
                type="button"
                onClick={() => stap1Klaar && setStap(2)}
                disabled={!stap1Klaar}
                style={{ width: '100%', padding: '0.9rem', background: stap1Klaar ? groen : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: stap1Klaar ? 'pointer' : 'default' }}
              >
                Volgende →
              </button>
            </>
          )}

          {stap === 2 && (
            <>
              <h1 style={{ margin: '0 0 0.4rem', color: '#1a1a1a', fontSize: '1.5rem' }}>Wat is jouw rol?</h1>
              <p style={{ color: '#555', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Kies de rol die het beste bij jou past. Op basis hiervan starten we met de module die het meest relevant is voor jouw werk.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {Object.keys(rolNaarModule).map((rol) => {
                  const moduleNr = rolNaarModule[rol]
                  const selected = form.rol === rol
                  return (
                    <div
                      key={rol}
                      onClick={() => setForm({ ...form, rol })}
                      style={{ padding: '1rem 1.25rem', border: selected ? `2px solid ${groen}` : '1.5px solid #e0e0e0', borderRadius: '10px', cursor: 'pointer', background: selected ? '#E0F5F4' : 'white', transition: 'all 0.15s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1a1a1a', marginBottom: '3px' }}>{rol}</div>
                          <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: moduleKleuren[moduleNr - 1], color: moduleTekstKleuren[moduleNr - 1] }}>
                            Start met: Module {moduleNr} – {moduleTitels[moduleNr - 1]}
                          </span>
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: selected ? `2px solid ${groen}` : '2px solid #ccc', background: selected ? groen : 'white', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStap(1)} style={{ flex: 1, padding: '0.9rem', background: 'white', color: '#1a1a1a', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  ← Terug
                </button>
                <button type="submit" disabled={!form.rol || laden} style={{ flex: 2, padding: '0.9rem', background: form.rol ? groen : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: form.rol ? 'pointer' : 'default' }}>
                  {laden ? 'Opslaan...' : 'Aan de slag →'}
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