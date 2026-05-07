import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.jpeg'
import { modulesData } from '../modulesData'

const blauw = '#012c75'
const groen = '#039aa3'

function Bewijs() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [voortgang, setVoortgang] = useState({})
  const [stap, setStap] = useState('reflectie')
  const [reflectie, setReflectie] = useState({
    verwachtingVoldaan: 5,
    kennisNiveauNu: 5,
    kennisNiveauToelichting: '',
    belangrijksteInzicht: '',
    eersteActie: '',
  })
  const [opgeslagen, setOpgeslagen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setProfiel(data)
        setVoortgang(data.voortgang || {})
        if (data.reflectie) {
          setReflectie(data.reflectie)
          setStap('bewijs')
        }
      }
    }
    haal()
  }, [user])

  const handleOpslaanReflectie = async () => {
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { reflectie }, { merge: true })
    setOpgeslagen(true)
    setStap('bewijs')
  }

  const totaalInzichten = modulesData.reduce((acc, m) => acc + m.leerdoelen.length, 0)
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  if (!profiel) return <div style={{ padding: '2rem' }}>Laden...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="bewijs" voortgang={voortgang} />

      <div style={{ marginLeft: '220px', padding: '2.5rem', flex: 1, maxWidth: '760px' }}>

        {stap === 'reflectie' && (
          <div>
            <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Reflectie</h1>
            <p style={{ color: '#888', marginBottom: '2rem' }}>Je hebt alle 4 modules afgerond — gefeliciteerd! Voordat je je bewijs van deelname ontvangt, vragen we je om kort terug te kijken op het leertraject.</p>

            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>

              {/* Verwachting terugkijken */}
              {profiel.verwachting && (
                <div style={{ background: '#f8f9ff', border: `1px solid ${blauw}20`, borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem' }}>
                  <p style={{ color: blauw, fontWeight: '600', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>Jouw verwachting bij de start</p>
                  <p style={{ color: '#444', margin: 0, fontStyle: 'italic' }}>"{profiel.verwachting}"</p>
                </div>
              )}

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontWeight: '600', color: '#222', display: 'block', marginBottom: '0.4rem' }}>In welke mate heeft de e-learning aan jouw verwachting voldaan?</label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Helemaal niet</span>
                  <span style={{ fontWeight: 'bold', color: blauw, fontSize: '1.2rem' }}>{reflectie.verwachtingVoldaan}/10</span>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Volledig</span>
                </div>
                <input type="range" min="1" max="10" value={reflectie.verwachtingVoldaan} onChange={(e) => setReflectie({ ...reflectie, verwachtingVoldaan: parseInt(e.target.value) })} style={{ width: '100%', accentColor: blauw }} />
              </div>

              {/* Kennisniveau vergelijking */}
              {profiel.kennisniveau && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ fontWeight: '600', color: '#222', display: 'block', marginBottom: '0.4rem' }}>
                    Bij de start gaf je jezelf een {profiel.kennisniveau}/10 voor kennisniveau. Welk cijfer zou je jezelf nu geven?
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Beginner</span>
                    <span style={{ fontWeight: 'bold', color: blauw, fontSize: '1.2rem' }}>{reflectie.kennisNiveauNu}/10</span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Expert</span>
                  </div>
                  <input type="range" min="1" max="10" value={reflectie.kennisNiveauNu} onChange={(e) => setReflectie({ ...reflectie, kennisNiveauNu: parseInt(e.target.value) })} style={{ width: '100%', accentColor: blauw }} />
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Toelichting — wat heeft dit veranderd?</label>
                    <textarea value={reflectie.kennisNiveauToelichting} onChange={(e) => setReflectie({ ...reflectie, kennisNiveauToelichting: e.target.value })} rows={2} placeholder="Bijv: Ik besefte dat ik veel meer wist dan ik dacht, maar ook dat er nog veel te leren is..." style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontWeight: '600', color: '#222', display: 'block', marginBottom: '0.4rem' }}>Wat is het belangrijkste inzicht dat je meeneemt?</label>
                <textarea value={reflectie.belangrijksteInzicht} onChange={(e) => setReflectie({ ...reflectie, belangrijksteInzicht: e.target.value })} rows={3} placeholder="Beschrijf in je eigen woorden het inzicht dat het meeste indruk heeft gemaakt..." style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ fontWeight: '600', color: '#222', display: 'block', marginBottom: '0.4rem' }}>Wat is de eerste concrete actie die je gaat ondernemen?</label>
                <textarea value={reflectie.eersteActie} onChange={(e) => setReflectie({ ...reflectie, eersteActie: e.target.value })} rows={3} placeholder="Bijv: Ik ga volgende week met een ervaringsdeskundige praten over onze ingang..." style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>

            <button onClick={handleOpslaanReflectie} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
              Bewijs van deelname ophalen →
            </button>
          </div>
        )}

        {stap === 'bewijs' && (
          <div>
            <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Bewijs van deelname</h1>
            <p style={{ color: '#888', marginBottom: '2rem' }}>Gefeliciteerd met het afronden van de InCultuur e-learning!</p>

            {/* Het certificaat */}
            <div id="certificaat" style={{ background: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', marginBottom: '1.5rem', border: `3px solid ${blauw}` }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <img src={logo} alt="InCultuur" style={{ height: '60px' }} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Datum van afronding</p>
                  <p style={{ margin: 0, fontWeight: '600', color: blauw }}>{datum}</p>
                </div>
              </div>

              <div style={{ borderTop: `2px solid ${groen}`, borderBottom: `2px solid ${groen}`, padding: '2rem 0', margin: '2rem 0', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>Dit certificaat wordt verleend aan</p>
                <h2 style={{ color: blauw, fontSize: '2rem', margin: '0 0 0.5rem' }}>{profiel.naam} {profiel.achternaam}</h2>
                <p style={{ color: '#666', margin: 0 }}>{profiel.functie} — {profiel.organisatie}</p>
              </div>

              <p style={{ textAlign: 'center', color: '#444', lineHeight: '1.7', marginBottom: '2rem' }}>
                heeft de InCultuur e-learning <strong>Toegankelijkheid in de cultuursector</strong> succesvol afgerond en daarmee <strong>{totaalInzichten} inzichten</strong> opgedaan over fysieke, digitale en sociale toegankelijkheid.
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', color: blauw, marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>OPGEDANE INZICHTEN</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {modulesData.map((module) => (
                    module.leerdoelen.map((doel, i) => (
                      <div key={`${module.nr}-${i}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.82rem' }}>
                        <span style={{ color: groen, flexShrink: 0, fontWeight: 'bold' }}>✓</span>
                        <span style={{ color: '#444' }}>{doel}</span>
                      </div>
                    ))
                  ))}
                </div>
              </div>

              {reflectie.eersteActie && (
                <div style={{ background: '#f8f9ff', borderRadius: '8px', padding: '1.25rem', border: `1px solid ${blauw}20` }}>
                  <p style={{ fontWeight: '600', color: blauw, margin: '0 0 0.4rem', fontSize: '0.85rem' }}>Eerste concrete actie</p>
                  <p style={{ color: '#444', margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>"{reflectie.eersteActie}"</p>
                </div>
              )}

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: blauw, fontSize: '0.9rem' }}>InCultuur</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>info@incultuur.nl</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>Dit bewijs is digitaal gegenereerd</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>{user?.email}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => window.print()} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                Afdrukken / Opslaan als PDF
              </button>
              <button onClick={() => setStap('reflectie')} style={{ padding: '0.85rem 2rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                Reflectie bekijken
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bewijs