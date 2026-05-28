import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import logoCommunity from '../assets/InCultuur-community.webp'
import logoDenHaag from '../assets/logo-denhaag.webp'

const groen = '#00A99D'
const groenDark = '#1A3080'

function Contact() {
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="contact" />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '640px' }}>

        <h1 style={{ color: '#1a1a1a', marginBottom: '0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>Contact</h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Heb je een vraag of loop je ergens tegenaan?</p>

        {/* Contact */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1rem' }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>InCultuur</h2>
          <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Heb je vragen over de inhoud van de Boost, technische problemen of andere vragen? Neem dan contact met ons op.
          </p>
          <a href="mailto:contact@incultuur.nl" style={{ color: groen, fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}>
            contact@incultuur.nl →
          </a>
        </div>

        {/* FAQ */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1rem' }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Veelgestelde vragen</h2>
          {[
            { vraag: 'Kan ik de Boost pauzeren?', antwoord: 'Ja, je voortgang en reflecties worden automatisch opgeslagen. Je kunt op elk moment stoppen en later verder gaan.' },
            { vraag: 'Moet ik alle modules doen?', antwoord: 'Je start met de module die past bij jouw rol. Daarna moedigen we je aan om ook de andere drie modules te doen — zo krijg je een compleet beeld van toegankelijkheid vanuit verschillende perspectieven.' },
            { vraag: 'Kan ik mijn reflecties terugzien?', antwoord: 'Ja, alle ingevulde reflecties en acties zijn terug te lezen via "Mijn profiel".' },
            { vraag: 'Hoe lang heb ik toegang?', antwoord: 'Je hebt toegang zolang het programma loopt. Ben je langer dan 3 maanden niet ingelogd? Dan wordt je account automatisch gedeactiveerd.' },
            { vraag: 'Is de InCultuur Boost officieel gecertificeerd?', antwoord: 'De Boost geeft geen officieel certificaat voor toegankelijkheid of inclusie. De scores en profielen zijn bedoeld als reflectie- en gesprekstool — niet als beoordeling.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #eee', paddingTop: i === 0 ? 0 : '1.25rem', marginTop: i === 0 ? 0 : '1.25rem' }}>
              <p style={{ fontWeight: '600', color: '#1a1a1a', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>{faq.vraag}</p>
              <p style={{ color: '#555', margin: 0, fontSize: '0.88rem', lineHeight: '1.7' }}>{faq.antwoord}</p>
            </div>
          ))}
        </div>

        {/* Privacy */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1rem', borderLeft: `4px solid ${groen}` }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Privacy & gegevens</h2>
          <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: '1.7', margin: 0 }}>
            Jouw gegevens worden uitsluitend gebruikt voor deelname aan de InCultuur Boost en eventuele verbetering van het programma. Wij verkopen of delen geen persoonlijke gegevens met derden. Na het afronden van de Boost worden je gegevens verwijderd uit onze actieve omgeving.
          </p>
        </div>

        {/* Partners */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Partners</h2>
          <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            De InCultuur Boost wordt aangeboden door:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
            <img src={logoCommunity} alt="InCultuur" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <img src={logoDenHaag} alt="Gemeente Den Haag" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>

      </main>
    </div>
  )
}

export default Contact