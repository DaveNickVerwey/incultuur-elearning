import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'
import { IconCultuur, IconBereik, IconSamenwerking, IconMogelijkheden } from '../components/doelgroepIconen'

const groen = '#00A99D'
const groenDark = '#1A3080'

const modules = [
  { nr: 1, titel: 'Makers van cultuur', Icoon: IconCultuur, omschrijving: 'Voor kunstenaars, programmeurs, curatoren, educatoren en iedereen die cultuur maakt.' },
  { nr: 2, titel: 'Makers van bereik', Icoon: IconBereik, omschrijving: 'Voor communicatie, social media, ticketing en publieksservice: iedereen die bepaalt hoe welkom bezoekers zich voelen.' },
  { nr: 3, titel: 'Makers van samenwerking', Icoon: IconSamenwerking, omschrijving: 'Voor HR, leidinggevenden en coördinatoren die werken aan inclusieve teams en toegankelijk werkgeverschap.' },
  { nr: 4, titel: 'Makers van mogelijkheden', Icoon: IconMogelijkheden, omschrijving: 'Voor productie, techniek, facilitair en organisatie: de mensen die toegankelijkheid mogelijk maken in de praktijk.' },
]

function ModulesUitleg() {
  const [user] = useAuthState(auth)
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

  const handleNaarDashboard = async () => {
    if (user) {
      const ref = doc(db, 'gebruikers', user.uid)
      await setDoc(ref, { welkomGezien: true }, { merge: true })
    }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: isMobiel ? 0 : '2rem', background: groenDark, overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, background: 'white', borderRadius: isMobiel ? '0' : '16px', padding: isMobiel ? '2rem 1.25rem' : '3rem', maxWidth: '720px', width: '100%', boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)', minHeight: isMobiel ? '100vh' : 'auto' }}>

        <p style={{ color: groen, fontWeight: '700', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
          De Boost
        </p>
        <h1 style={{ color: groenDark, fontSize: isMobiel ? '1.5rem' : '1.9rem', margin: '0 0 0.5rem', fontWeight: '700' }}>
          Modules
        </h1>
        <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
          De InCultuur Boost bestaat uit vier doelgroepgerichte modules van ongeveer 15 minuten:
        </p>

        {/* Module kaarten */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {modules.map((m) => (
            <div key={m.nr} style={{ background: '#E0F5F4', borderRadius: '12px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: groenDark }}>
                <m.Icoon size={26} stroke={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: groen }}>{m.nr}.</span>
                  <h3 style={{ margin: 0, color: groenDark, fontSize: '1rem', fontWeight: '700' }}>{m.titel}</h3>
                </div>
                <p style={{ margin: 0, color: '#333', fontSize: '0.88rem', lineHeight: '1.55' }}>{m.omschrijving}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Samen één complete boost */}
        <div style={{ background: 'white', border: `1.5px solid ${groen}30`, borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: groenDark, fontSize: '1rem' }}>Samen één complete boost</h3>
          <p style={{ color: '#444', lineHeight: '1.65', margin: 0, fontSize: '0.9rem' }}>
            Elke module biedt een eigen perspectief. Samen laten ze zien hoe toegankelijkheid en inclusie samenkomen in cultuur, communicatie, organisatie en publieksbeleving. Zo ontdek je hoe iedere rol het verschil kan maken.
          </p>
        </div>

        <button
          onClick={handleNaarDashboard}
          style={{ width: '100%', padding: '1rem', background: groen, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
        >
          Aan de slag! →
        </button>
      </div>
    </div>
  )
}

export default ModulesUitleg