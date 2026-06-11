import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const groen = '#00A99D'
const groenDark = '#1A3080'

const faqs = [
  { vraag: 'Kan ik de Boost pauzeren?', antwoord: 'Ja, je voortgang en reflecties worden automatisch opgeslagen. Je kunt op elk moment stoppen en later verder gaan.' },
  { vraag: 'Moet ik alle modules doen?', antwoord: 'Je start met de module die past bij jouw rol. Daarna moedigen we je aan om ook de andere drie modules te doen — zo krijg je een compleet beeld van toegankelijkheid vanuit verschillende perspectieven.' },
  { vraag: 'Kan ik mijn reflecties terugzien?', antwoord: 'Ja, alle ingevulde reflecties en acties zijn terug te lezen via "Mijn profiel".' },
  { vraag: 'Hoe lang heb ik toegang?', antwoord: 'Je hebt toegang zolang het programma loopt. Ben je langer dan 3 maanden niet ingelogd? Dan wordt je account automatisch gedeactiveerd.' },
  { vraag: 'Is de InCultuur Boost officieel gecertificeerd?', antwoord: 'De Boost geeft geen officieel certificaat voor toegankelijkheid of inclusie. De scores en profielen zijn bedoeld als reflectie- en gesprekstool — niet als beoordeling.' },
]

function Faq() {
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="faq" />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '640px' }}>
        <h1 style={{ color: '#1a1a1a', marginBottom: '0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>Veelgestelde vragen</h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Antwoorden op de meest voorkomende vragen over de InCultuur Boost.</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #eee', paddingTop: i === 0 ? 0 : '1.25rem', marginTop: i === 0 ? 0 : '1.25rem' }}>
              <p style={{ fontWeight: '600', color: '#1a1a1a', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>{faq.vraag}</p>
              <p style={{ color: '#555', margin: 0, fontSize: '0.88rem', lineHeight: '1.7' }}>{faq.antwoord}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Faq