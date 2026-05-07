import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const blauw = '#012c75'
const groen = '#027a82'

function Welkom() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const isMobiel = window.innerWidth < 768
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const haalProfiel = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haalProfiel()
  }, [user])

  if (!profiel) return <div style={{ padding: '2rem' }}>Laden...</div>

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>

      {/* Achtergrondafbeelding */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(1px)', opacity: 0.755, zIndex: 0, transform: 'scale(1.05)' }} />

      {/* Inhoud */}
      <div style={{ position: 'relative', zIndex: 1, background: 'white', borderRadius: isMobiel ? '0' : '16px', padding: isMobiel ? '2rem 1.5rem' : '3rem', maxWidth: '640px', width: '100%', margin: isMobiel ? 0 : '2rem', boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.12)', minHeight: isMobiel ? '100vh' : 'auto' }}>

        <div style={{ width: '40px', height: '40px', background: blauw, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {profiel ? `${profiel.naam.charAt(0)}${profiel.achternaam.charAt(0)}`.toUpperCase() : 'IC'}
        </div>

        <h1 style={{ color: blauw, fontSize: isMobiel ? '1.5rem' : '1.75rem', margin: '0 0 0.5rem' }}>
          Hi {profiel.naam}, tof dat je erbij bent! 👋
        </h1>

        <p style={{ color: groen, fontWeight: '600', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Welkom bij de InCultuur e-learning over toegankelijkheid in de cultuursector
        </p>

        <div style={{ color: '#444', lineHeight: '1.7', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Toegankelijkheid gaat over meer dan een rolstoelhellingbaan bij de ingang. Het gaat over de vraag wie zich welkom voelt in jouw organisatie — en wie niet.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            In deze e-learning verken je samen met collega's uit de cultuursector wat toegankelijkheid betekent in de praktijk. Van wet- en regelgeving tot prikkelarme ruimtes, van inclusieve communicatie tot samenwerken met ervaringsdeskundigen.
          </p>

          <div style={{ background: '#f8f9ff', border: `1px solid ${blauw}20`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: '600', color: blauw, margin: '0 0 1rem' }}>Hoe werkt de e-learning?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { nr: 1, tekst: 'Volg de 4 modules op volgorde — elke module duurt ongeveer 15 minuten' },
                { nr: 2, tekst: 'Elke module bevat theorie, een praktijkvoorbeeld en een korte quiz' },
                { nr: 3, tekst: 'Aan het einde van elke module is er een concreet actiepunt voor jouw organisatie' },
                { nr: 4, tekst: 'Rond je alle modules af? Dan ontvang je een bewijs van deelname' },
              ].map((stap) => (
                <div key={stap.nr} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
<div style={{ width: '28px', height: '28px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0, marginTop: '0.1rem' }}>{stap.nr}</div><p style={{ margin: 0, color: '#444', fontSize: '0.9rem', lineHeight: '1.6' }}>{stap.tekst}</p>                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <iframe width="100%" height={isMobiel ? '200' : '315'} src="https://www.youtube.com/embed/3qWs7rInuiQ" title="InCultuur introductievideo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
          </div>

          <p style={{ color: '#555', fontSize: '0.85rem' }}>
            Je voortgang wordt automatisch opgeslagen. Je kunt de e-learning op elk moment pauzeren en later verder gaan.
          </p>
        </div>

        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '2rem', width: '100%', padding: '1rem', background: blauw, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
          Naar mijn dashboard →
        </button>
      </div>
    </div>
  )
}

export default Welkom