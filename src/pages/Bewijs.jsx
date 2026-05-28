import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.jpeg'
import { modulesData } from '../modulesData'

const groen = '#00A99D'
const groenDark = '#1A3080'

function Bewijs() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [voortgang, setVoortgang] = useState({})
  const [reflecties, setReflecties] = useState({})
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setProfiel(data)
        setVoortgang(data.voortgang || {})
        const alleReflecties = {}
        modulesData.forEach((m) => {
          alleReflecties[m.nr] = {
            reflecties: data[`reflecties_${m.nr}`] || null,
            actie: data[`actie_${m.nr}`] || null,
          }
        })
        setReflecties(alleReflecties)
      }
    }
    haal()
  }, [user])

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const afgerondModules = modulesData.filter((m) => voortgang[m.nr])

  const profielKleuren = {
    Ontdekker:       { bg: '#E0F5F4', tekst: groenDark, icoon: '🌱' },
    Kijker:          { bg: '#E8EFFE', tekst: groenDark, icoon: '👀' },
    Drempelverlager: { bg: '#EFEDFC', tekst: groenDark, icoon: '🚪' },
    Voorloper:       { bg: '#FDF0DC', tekst: '#7A4A05', icoon: '⭐' },
  }
  const pk = profielKleuren[profiel.profielType]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="bewijs" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '800px' }}>

        <h1 style={{ color: '#1a1a1a', marginBottom: '0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>Bewijs van deelname</h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Sla op als PDF via de printknop onderaan.</p>

        {/* ── CERTIFICAAT ── */}
        <div id="certificaat" style={{
          background: 'white',
          borderRadius: '16px',
          padding: isMobiel ? '1.5rem' : '3rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem',
          border: `3px solid ${groenDark}`,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <img src={logo} alt="InCultuur" style={{ height: isMobiel ? '36px' : '52px', objectFit: 'contain' }} />
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Datum van afronding</p>
              <p style={{ margin: 0, fontWeight: '600', color: groenDark, fontSize: '0.9rem' }}>{datum}</p>
            </div>
          </div>

          {/* Naam blok */}
          <div style={{ borderTop: `2px solid ${groen}`, borderBottom: `2px solid ${groen}`, padding: '1.5rem 0', margin: '0 0 2rem', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.88rem', margin: '0 0 0.4rem' }}>Dit bewijs van deelname wordt verleend aan</p>
            <h2 style={{ color: groenDark, fontSize: isMobiel ? '1.4rem' : '2rem', margin: '0 0 0.4rem', fontWeight: '700' }}>
              {profiel.naam} {profiel.achternaam}
            </h2>
            <p style={{ color: '#555', margin: 0, fontSize: '0.95rem' }}>{profiel.functie} — {profiel.organisatie}</p>
          </div>

          {/* Intro tekst */}
          <p style={{ textAlign: 'center', color: '#444', lineHeight: '1.75', marginBottom: '2rem', fontSize: '0.95rem' }}>
            heeft de <strong>InCultuur Boost</strong> succesvol afgerond — een praktische e-learning over
            toegankelijkheid en inclusie in de cultuursector, ontwikkeld door InCultuur Den Haag.
          </p>

          {/* In-Check profiel */}
          {profiel.profielType && pk && (
            <div style={{ background: pk.bg, borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{pk.icoon}</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: pk.tekst, textTransform: 'uppercase', marginBottom: '2px' }}>In-Check profiel bij aanvang</div>
                <div style={{ fontWeight: '600', color: pk.tekst }}>{profiel.profielType}</div>
              </div>
            </div>
          )}

          {/* Afgeronde modules + reflecties */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontWeight: '700', color: groenDark, marginBottom: '1rem', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Afgeronde modules & reflecties
            </p>

            {afgerondModules.map((module) => {
              const mod = reflecties[module.nr]
              return (
                <div key={module.nr} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700', flexShrink: 0 }}>
                      {module.nr}
                    </div>
                    <h3 style={{ margin: 0, color: groenDark, fontSize: '0.95rem', fontWeight: '700' }}>{module.titel}</h3>
                  </div>

                  {mod?.reflecties && (
                    <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {module.reflectieVragen.map((vraag) => {
                        const antwoord = mod.reflecties[vraag.id]
                        if (!antwoord) return null
                        return (
                          <div key={vraag.id} style={{ background: '#f0fafa', borderRadius: '6px', padding: '0.6rem 0.875rem', borderLeft: `3px solid ${groen}` }}>
                            <p style={{ margin: '0 0 0.2rem', fontSize: '0.75rem', fontWeight: '600', color: groenDark }}>{vraag.vraag}</p>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#444', lineHeight: '1.55', fontStyle: 'italic' }}>"{antwoord}"</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {mod?.actie && (
                    <div style={{ marginLeft: '2rem', background: '#EFEDFC', borderRadius: '6px', padding: '0.6rem 0.875rem', borderLeft: '3px solid #6B5ECC' }}>
                      <p style={{ margin: '0 0 0.2rem', fontSize: '0.75rem', fontWeight: '600', color: '#3D3280' }}>Actie-opdracht</p>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#444', lineHeight: '1.55', fontStyle: 'italic' }}>
                        "{module.actieOpdracht.prefix} {mod.actie}"
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer certificaat */}
          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: groenDark, fontSize: '0.9rem' }}>InCultuur Den Haag</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#666' }}>contact@incultuur.nl</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>Digitaal bewijs van deelname</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Knoppen */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{ padding: '0.85rem 2rem', background: groenDark, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}
          >
            🖨 Afdrukken / Opslaan als PDF
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '0.85rem 2rem', background: 'white', color: groenDark, border: `1.5px solid ${groenDark}`, borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}
          >
            ← Terug naar dashboard
          </button>
        </div>

      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificaat, #certificaat * { visibility: visible; }
          #certificaat {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            padding: 2rem !important;
            box-shadow: none !important;
            border: 3px solid ${groenDark} !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Bewijs