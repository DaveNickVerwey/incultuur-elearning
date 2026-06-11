import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'
import logoCommunity from '../assets/InCultuur-community.webp'
import logoDenHaag from '../assets/logo-denhaag.webp'

const groen = '#00A99D'
const groenDark = '#1A3080'

function WelkomIntro() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (user === null) navigate('/login')
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haal()
  }, [user])

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: isMobiel ? 0 : '2rem', background: groenDark, overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, background: 'white', borderRadius: isMobiel ? '0' : '16px', padding: isMobiel ? '2rem 1.25rem' : '3rem', maxWidth: '720px', width: '100%', boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)', minHeight: isMobiel ? '100vh' : 'auto', marginTop: isMobiel ? 0 : 'auto', marginBottom: isMobiel ? 0 : 'auto' }}>

        <p style={{ color: groen, fontWeight: '700', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
          InCultuur Boost
        </p>
        <h1 style={{ color: groenDark, fontSize: isMobiel ? '1.6rem' : '2rem', margin: '0 0 0.4rem', fontWeight: '700', lineHeight: '1.2' }}>
          Welkom, {profiel.naam}!
        </h1>
        <p style={{ color: '#444', fontSize: '1rem', margin: '0 0 2rem', fontStyle: 'italic' }}>
          Toegankelijkheid & inclusie voor de cultuursector
        </p>

        {/* Sectie: Waarom */}
        <h2 style={{ color: groenDark, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Waarom deze Boost?</h2>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
          Cultuur werkt pas echt als iedereen kan meedoen. Als bezoeker, maker, artiest, medewerker, vrijwilliger of organisator.
        </p>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Ongeveer 1 op de 7 Nederlanders leeft met een beperking of chronische aandoening. Veel van hen ervaren nog dagelijks drempels bij culturele activiteiten. Die drempels kunnen zichtbaar zijn, zoals een ontoegankelijk gebouw, maar ook onzichtbaar, zoals ingewikkelde communicatie of een gebrek aan begrip.
        </p>

        {/* Sectie: Recht */}
        <h2 style={{ color: groenDark, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Toegankelijkheid is een recht</h2>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Nederland heeft het VN-verdrag Handicap ondertekend. Dat betekent dat iedereen recht heeft op gelijke toegang tot cultuur, informatie, communicatie en voorzieningen. Toegankelijkheid is dus geen extra service, maar een basisvoorwaarde voor deelname.
        </p>

        {/* Sectie: Code D&I */}
        <h2 style={{ color: groenDark, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>De Code Diversiteit & Inclusie</h2>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          De culturele sector werkt met de Code Diversiteit & Inclusie. Deze helpt organisaties om inclusiever te werken op vier gebieden:
        </p>
        <ul style={{ color: '#333', lineHeight: '1.85', fontSize: '0.95rem', marginBottom: '2rem', paddingLeft: '1.25rem' }}>
          <li><strong>Programma</strong> – wat je maakt en organiseert</li>
          <li><strong>Publiek</strong> – wie zich welkom voelt</li>
          <li><strong>Personeel</strong> – wie er werkt en meedoet</li>
          <li><strong>Partners</strong> – met wie je samenwerkt</li>
        </ul>

        {/* Sectie: Wat kun jij doen */}
        <h2 style={{ color: groenDark, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Wat kun jij doen?</h2>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
          Toegankelijkheid begint vaak met kleine stappen:
        </p>
        <ul style={{ color: '#333', lineHeight: '1.85', fontSize: '0.95rem', marginBottom: '1rem', paddingLeft: '1.25rem' }}>
          <li>duidelijke informatie en routes</li>
          <li>ondertiteling of alternatieve vormen van communicatie</li>
          <li>rustige, prikkelarme plekken</li>
          <li>een open en gastvrije houding</li>
          <li>luisteren naar ervaringen van anderen</li>
        </ul>
        <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Iedereen kan bijdragen aan een cultuursector waarin meer mensen zich welkom voelen. Ook jij.
        </p>

        {/* Sectie: Blijf toegankelijk */}
        <div style={{ background: '#E0F5F4', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${groen}` }}>
          <h2 style={{ color: groenDark, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>Blijf toegankelijk</h2>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
            Word onderdeel van de InCultuur Community. Binnen deze community werken culturele organisaties, makers, professionals, bezoekers en ervaringsdeskundigen samen aan een toegankelijkere en inclusievere Haagse cultuursector.
          </p>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.92rem', marginBottom: '0.5rem' }}>De community is een plek voor:</p>
          <ul style={{ color: '#333', lineHeight: '1.8', fontSize: '0.92rem', marginBottom: '0.75rem', paddingLeft: '1.25rem' }}>
            <li>kennisdeling</li>
            <li>praktijkvoorbeelden</li>
            <li>inspiratie</li>
            <li>ontmoeting</li>
            <li>samenwerking</li>
            <li>gezamenlijke uitdagingen en oplossingen</li>
          </ul>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.92rem', margin: 0 }}>
            Mail naar <a href="mailto:contact@incultuur.nl" style={{ color: groenDark, fontWeight: '600' }}>contact@incultuur.nl</a> en je ontvangt informatie en inloggegevens voor de InCultuur app.
          </p>
        </div>

        {/* Initiatief tekst + logo's */}
        <p style={{ color: '#666', fontSize: '0.82rem', textAlign: 'center', marginBottom: '1rem', lineHeight: '1.6' }}>
          De InCultuur Boost is een initiatief van InCultuur Community,<br />
          mogelijk gemaakt door de Gemeente Den Haag / Toegankelijke Stad
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src={logoCommunity} alt="InCultuur Community" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <img src={logoDenHaag} alt="Gemeente Den Haag" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/welkom')}
          style={{ width: '100%', padding: '1rem', background: groen, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
        >
          Doe de InCheck →
        </button>
      </div>
    </div>
  )
}

export default WelkomIntro