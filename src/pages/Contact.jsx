import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const blauw = '#012c75'
const groen = '#027a82'

function Contact() {
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="contact" />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.5rem 1.5rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '640px' }}>
        <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Contact</h1>
        <p style={{ color: '#555', marginBottom: '2rem' }}>Heb je een vraag of loop je ergens tegenaan?</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
          <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1rem', fontSize: '1.15rem' }}>InCultuur</h2>
          <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1rem' }}>
            Heb je vragen over de inhoud van de e-learning, technische problemen of andere vragen? Neem dan contact met ons op via onderstaand e-mailadres.
          </p>
          <a href="mailto:info@incultuur.nl" style={{ color: groen, fontWeight: '600', textDecoration: 'none' }}>
            info@incultuur.nl
          </a>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
          <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem', fontSize: '1.15rem' }}>Veelgestelde vragen</h2>
          {[
            { vraag: 'Kan ik de e-learning pauzeren?', antwoord: 'Ja, je voortgang wordt automatisch opgeslagen. Je kunt op elk moment stoppen en later verder gaan.' },
            { vraag: 'Moet ik de modules op volgorde doen?', antwoord: 'Ja, elke module bouwt voort op de vorige. Module 2 wordt pas beschikbaar als je module 1 hebt afgerond.' },
            { vraag: 'Hoe lang heb ik toegang?', antwoord: 'Je hebt toegang zolang het programma loopt. Je ontvangt een bericht als de toegang verloopt.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #eee', paddingTop: i === 0 ? 0 : '1.25rem', marginTop: i === 0 ? 0 : '1.25rem' }}>
              <p style={{ fontWeight: '600', color: '#222', margin: '0 0 0.6rem' }}>{faq.vraag}</p>
              <p style={{ color: '#555', margin: 0, fontSize: '0.9rem', lineHeight: '1.7' }}>{faq.antwoord}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: blauw, marginTop: 0, marginBottom: '0.5rem', fontSize: '1.15rem' }}>Partners</h2>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Deze e-learning wordt aangeboden en gedragen door:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            {[
              { naam: 'Gemeente Den Haag', bestand: '/src/assets/logo-denhaag.png' },
              { naam: 'Filmhuis Den Haag', bestand: '/src/assets/logo-filmhuis.png' },
              { naam: 'Nationale Theater', bestand: '/src/assets/logo-hnt.png' },
              { naam: 'Paard Den Haag', bestand: '/src/assets/logo-paard.webp' },
            ].map((partner) => (
              <div key={partner.naam} title={partner.naam}>
                <img src={partner.bestand} alt={partner.naam} style={{ height: '40px', width: 'auto', filter: 'brightness(0)', opacity: 0.75, objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact