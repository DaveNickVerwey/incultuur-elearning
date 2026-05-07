import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import logoDenhaag from '../assets/logo-denhaag.png'
import logoFilmhuis from '../assets/logo-filmhuis.png'
import logoHnt from '../assets/logo-hnt.png'
import logoPaard from '../assets/logo-paard.webp'

const blauw = '#012c75'
const groen = '#039aa3'

const partners = [
  { naam: 'Gemeente Den Haag', logo: logoDenhaag },
  { naam: 'Filmhuis Den Haag', logo: logoFilmhuis },
  { naam: 'Nationale Theater', logo: logoHnt },
  { naam: 'Paard Den Haag', logo: logoPaard },
]

function Contact() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="contact" />

      <div style={{ marginLeft: '220px', padding: '2.5rem', flex: 1, maxWidth: '640px' }}>
        <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Contact</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Heb je een vraag of loop je ergens tegenaan?</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
          <h3 style={{ color: blauw, marginTop: 0, marginBottom: '1rem' }}>InCultuur</h3>
          <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '1rem' }}>
            Heb je vragen over de inhoud van de e-learning, technische problemen of andere vragen? Neem dan contact met ons op via onderstaand e-mailadres.
          </p>
          <a href="mailto:info@incultuur.nl" style={{ color: groen, fontWeight: '600', textDecoration: 'none' }}>
            info@incultuur.nl
          </a>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
          <h3 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem' }}>Veelgestelde vragen</h3>
          {[
            { vraag: 'Kan ik de e-learning pauzeren?', antwoord: 'Ja, je voortgang wordt automatisch opgeslagen. Je kunt op elk moment stoppen en later verder gaan.' },
            { vraag: 'Moet ik de modules op volgorde doen?', antwoord: 'Ja, elke module bouwt voort op de vorige. Module 2 wordt pas beschikbaar als je module 1 hebt afgerond.' },
            { vraag: 'Hoe lang heb ik toegang?', antwoord: 'Je hebt toegang zolang het programma loopt. Je ontvangt een bericht als de toegang verloopt.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid #eee', paddingTop: i === 0 ? 0 : '1.25rem', marginTop: i === 0 ? 0 : '1.25rem' }}>
              <p style={{ fontWeight: '600', color: '#222', margin: '0 0 0.6rem' }}>{faq.vraag}</p>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem', lineHeight: '1.7' }}>{faq.antwoord}</p>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: blauw, marginTop: 0, marginBottom: '0.5rem' }}>Partners</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Deze e-learning wordt aangeboden en gedragen door:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            {partners.map((partner) => (
              <div key={partner.naam} title={partner.naam}>
                <img
                  src={partner.logo}
                  alt={partner.naam}
                  style={{ height: '40px', width: 'auto', filter: 'brightness(0)', opacity: 0.75, objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact