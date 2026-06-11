import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const groen = '#00A99D'
const groenDark = '#1A3080'

function Privacy() {
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="privacy" />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '640px' }}>
        <h1 style={{ color: '#1a1a1a', marginBottom: '0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>Privacy & gegevens</h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Hoe gaan we om met jouw gegevens?</p>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.5rem', borderLeft: `4px solid ${groen}` }}>
          <p style={{ color: '#444', fontSize: '0.92rem', lineHeight: '1.75', margin: 0 }}>
            Jouw gegevens worden uitsluitend gebruikt voor deelname aan de InCultuur Boost en eventuele verbetering van het programma. Wij verkopen of delen geen persoonlijke gegevens met derden. Na het afronden van de Boost worden je gegevens verwijderd uit onze actieve omgeving.
          </p>
        </div>

        <div style={{ background: '#FDF0DC', borderRadius: '12px', padding: '1.75rem', border: '1px solid #f0d090' }}>
          <h2 style={{ color: '#7A4A05', marginTop: 0, marginBottom: '0.75rem', fontSize: '1.05rem' }}>
            InCultuur Boost is een pilot
          </h2>
          <p style={{ color: '#5a3a0a', fontSize: '0.92rem', lineHeight: '1.75', marginBottom: '0.75rem' }}>
            De InCultuur Boost bevindt zich momenteel in een ontwikkel- en testfase (pilot). Dit betekent dat:
          </p>
          <ul style={{ color: '#5a3a0a', fontSize: '0.92rem', lineHeight: '1.85', marginBottom: '0.75rem', paddingLeft: '1.25rem' }}>
            <li>onderdelen nog doorontwikkeld worden</li>
            <li>sommige functionaliteiten nog niet volledig toegankelijk zijn</li>
            <li>wij actief leren van feedback van deelnemers, testers en ervaringsdeskundigen</li>
          </ul>
          <p style={{ color: '#5a3a0a', fontSize: '0.92rem', lineHeight: '1.75', margin: 0 }}>
            Wij nodigen je uit om feedback te geven en ervaringen of verbeterpunten te delen via <a href="mailto:contact@incultuur.nl" style={{ color: '#7A4A05', fontWeight: '600' }}>contact@incultuur.nl</a>.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Privacy