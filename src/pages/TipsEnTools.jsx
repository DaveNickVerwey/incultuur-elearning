import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import Sidebar from '../components/Sidebar'

const groen = '#00A99D'
const groenDark = '#1A3080'

// Doelgroep symbolen
export const doelgroepSymbolen = {
  C: { label: 'Makers van Cultuur',        icoon: '🎭', kleur: '#E0F5F4', tekstKleur: groenDark },
  B: { label: 'Makers van Bereik',         icoon: '📢', kleur: '#E8EFFE', tekstKleur: groenDark },
  S: { label: 'Makers van Samenwerking',   icoon: '🤝', kleur: '#EFEDFC', tekstKleur: groenDark },
  M: { label: 'Makers van Mogelijkheden',  icoon: '⚙️', kleur: '#FDF0DC', tekstKleur: groenDark },
}

// Koppeling rol → doelgroep letter
export const rolNaarLetter = {
  'Programmeur / curator / artiest / educator':                  'C',
  'Communicatie / social media / ticketing / publieksservice':   'B',
  'HR / leidinggevende / coördinator':                           'S',
  'Productie / facilitair / techniek / planning':                'M',
  'Anders / meerdere rollen':                                    'C',
}

// Alle tips & tools
const tips = [
  {
    titel: 'Waarom toegang tot kunst essentieel is voor iedereen',
    url: 'https://www.youtube.com/watch?v=_wUhAfjJ73g',
    type: 'video',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Het is een gewone voorstelling',
    url: 'https://vimeo.com/362390325',
    type: 'video',
    doelgroepen: ['C', 'B', 'M'],
  },
  {
    titel: 'Hoe vergroot je toegankelijkheid in een culturele organisatie?',
    url: 'https://codedi.nl/tips-om-toegankelijkheid-te-vergroten-als-culturele-organisatie',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Diversiteit en inclusie in musea: praktische aanpak',
    url: 'https://museumvereniging.nl/diversiteit-inclusie-toegankelijkheid-nieuwspagina/',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Maak kunst toegankelijk voor iedereen',
    url: 'https://www.cultuurschakel.nl/kennisbank/maak-kunst-en-cultuur-toegankelijk-voor-iedereen-5-tips/',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Interactieve tentoonstelling met audio, geur en reliëf',
    url: 'https://www.coda-apeldoorn.nl/nieuws/4/coda-museum-voegt-audio-geur-en-reliefborden-toe-aan-tentoonstelling',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'S'],
  },
  {
    titel: 'Waarom diversiteit geen trend is maar een noodzaak',
    url: 'https://www.zbdtalent.com/eur/our-story/',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Manifest: artiesten met een beperking centraal',
    url: 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:020de002-cadb-4179-870d-51247a70b59f',
    type: 'document',
    doelgroepen: ['C', 'S', 'M'],
  },
  {
    titel: 'Hoe organiseer je toegankelijke evenementen',
    url: 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:a962c480-1cd3-4e95-a8ea-180040cbf3c0',
    type: 'document',
    doelgroepen: ['C', 'B', 'M'],
  },
  {
    titel: 'Toolkit voor inclusieve podia en artiesten',
    url: 'https://discoverrevelland.today/toolkit/',
    type: 'tool',
    doelgroepen: ['C', 'B'],
  },
  {
    titel: 'Digitale toegankelijkheid: wat moet je regelen?',
    url: 'https://den.nl/digitale-toegankelijkheid',
    type: 'artikel',
    doelgroepen: ['B', 'M'],
  },
  {
    titel: '10 stappen naar een toegankelijker theater',
    url: 'https://www.theaterkrant.nl/nieuws/tien-punten-om-elk-theater-inclusiever-te-maken/',
    type: 'artikel',
    doelgroepen: ['C', 'M'],
  },
  {
    titel: 'De stand van inclusieve podiumkunsten',
    url: 'https://youtu.be/gU5TkZeP7qc',
    type: 'video',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Kunst en Cultuur voor slechtzienden',
    url: 'https://www.kubes.nl/',
    type: 'website',
    doelgroepen: ['C', 'B'],
  },
  {
    titel: 'Cultuur voor een veerkrachtige samenleving',
    url: 'https://www.lkca.nl/',
    type: 'website',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Toegankelijkheidsexpertise in Den Haag',
    url: 'http://www.voorall.nl',
    type: 'website',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Subsidie voor een toegankelijke stad',
    url: 'https://www.denhaag.nl/nl/subsidies/subsidie-toegankelijke-stad-aanvragen/',
    type: 'subsidie',
    doelgroepen: ['S', 'M'],
  },
  {
    titel: 'Festivals voor iedereen',
    url: 'https://coalitievoorinclusie.nl/festivals-voor-iedereen/',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'M'],
  },
  {
    titel: 'Toegankelijk theater (video)',
    url: 'https://www.youtube.com/watch?v=weuTbd6qIAE',
    type: 'video',
    doelgroepen: ['C', 'B', 'M'],
  },
  {
    titel: 'Neurodiversiteit op de werkvloer',
    url: 'https://www.ser.nl/-/media/ser/downloads/thema/dib/2025/charterdocument-neurodiversiteit.pdf',
    type: 'document',
    doelgroepen: ['S', 'M', 'B'],
  },
  {
    titel: 'Divers talent werven en behouden',
    url: 'https://werkenvoorcultuur.nl/artikelen/hoe-maak-je-werving-en-selectie-echt-inclusief/',
    type: 'artikel',
    doelgroepen: ['S', 'M', 'B'],
  },
  {
    titel: 'Toegankelijke audio en video',
    url: 'https://www.care.nl/kennis-en-inspiratie/toegankelijke-videos-en-audiofragmenten',
    type: 'artikel',
    doelgroepen: ['C', 'B', 'M'],
  },
  {
    titel: 'Onbeperkt aan het werk',
    url: 'https://onbeperktaandeslag.nl/',
    type: 'website',
    doelgroepen: ['S', 'M', 'B'],
  },
  {
    titel: 'Financiële regelingen voor inclusieve werkplekken',
    url: 'https://www.rijksoverheid.nl/onderwerpen/participatiewet/vraag-en-antwoord/welke-financiele-regelingen-zijn-er-voor-werkgevers-die-mensen-in-dienst-hebben-met-een-arbeidsbeperking',
    type: 'subsidie',
    doelgroepen: ['S', 'M'],
  },
  {
    titel: 'Werk en autisme: ondersteuning en kansen',
    url: 'https://www.autitalent.nl/',
    type: 'website',
    doelgroepen: ['S', 'M'],
  },
  {
    titel: 'Iedereen op z\'n plek',
    url: 'https://swom.nl/',
    type: 'website',
    doelgroepen: ['S', 'M'],
  },
  {
    titel: 'Versterk jouw team',
    url: 'https://superkracht.club/',
    type: 'website',
    doelgroepen: ['S', 'M'],
  },
  {
    titel: 'Platform voor inclusief leven en beleven',
    url: 'https://www.kenniscentrum-og.nl/',
    type: 'website',
    doelgroepen: ['C', 'B', 'S', 'M'],
  },
  {
    titel: 'Leuk en toegankelijk voor kinderen',
    url: 'https://nijntjemuseum.nl/nl/toegankelijkheid/',
    type: 'artikel',
    doelgroepen: ['C', 'B'],
  },
]

const typeIcoon = {
  video:    { icoon: '▶', label: 'Video',    kleur: '#fee2e2', tekst: '#991b1b' },
  artikel:  { icoon: '📄', label: 'Artikel',  kleur: '#E0F5F4', tekst: groenDark },
  document: { icoon: '📋', label: 'Document', kleur: '#E8EFFE', tekst: groenDark },
  tool:     { icoon: '🛠', label: 'Tool',     kleur: '#EFEDFC', tekst: groenDark },
  website:  { icoon: '🌐', label: 'Website',  kleur: '#f0fdf4', tekst: groenDark },
  subsidie: { icoon: '💶', label: 'Subsidie', kleur: '#FDF0DC', tekst: '#7A4A05' },
}

function TipsEnTools() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [voortgang, setVoortgang] = useState({})
  const [filter, setFilter] = useState('alle')
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

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
        setProfiel(snap.data())
        setVoortgang(snap.data().voortgang || {})
      }
    }
    haal()
  }, [user])

  const mijnLetter = profiel ? rolNaarLetter[profiel.rol] || 'C' : null

  // Stel standaard filter in op jouw doelgroep
  useEffect(() => {
    if (mijnLetter) setFilter(mijnLetter)
  }, [mijnLetter])

  const gefilterdeТips = filter === 'alle'
    ? tips
    : tips.filter((t) => t.doelgroepen.includes(filter))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="tipstools" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', flex: 1, overflowX: 'hidden' }}>

        {/* Hero */}
        <div style={{ background: groenDark, padding: isMobiel ? '4rem 1.5rem 2rem' : '3rem 2.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontWeight: '600', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Inspiratie & kennis
          </p>
          <h1 style={{ color: 'white', fontSize: isMobiel ? '1.5rem' : '2rem', margin: '0 0 0.5rem', fontWeight: '700' }}>
            Tips & Tools
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', fontStyle: 'italic' }}>
            Artikelen, video's en tools over toegankelijkheid en inclusie in de cultuursector
          </p>
        </div>

        <div style={{ padding: isMobiel ? '1.5rem 1.1rem' : '2.5rem', maxWidth: '860px' }}>

          {/* Doelgroep legenda */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: '#595959', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              De vier doelgroepen
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {Object.entries(doelgroepSymbolen).map(([letter, d]) => (
                <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: d.kleur, border: mijnLetter === letter ? `2px solid ${groenDark}` : '1.5px solid transparent' }}>
                  <span style={{ fontSize: '1rem' }}>{d.icoon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: groenDark }}>{letter} — {d.label}</span>
                  {mijnLetter === letter && <span style={{ fontSize: '10px', background: groenDark, color: 'white', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>jij</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Filter knoppen */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('alle')}
              style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'system-ui', background: filter === 'alle' ? groenDark : 'white', color: filter === 'alle' ? 'white' : '#444', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              Alle ({tips.length})
            </button>
            {Object.entries(doelgroepSymbolen).map(([letter, d]) => {
              const aantal = tips.filter((t) => t.doelgroepen.includes(letter)).length
              return (
                <button
                  key={letter}
                  onClick={() => setFilter(letter)}
                  style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'system-ui', background: filter === letter ? groenDark : 'white', color: filter === letter ? 'white' : '#444', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>{d.icoon}</span>
                  <span>{letter} ({aantal})</span>
                  {mijnLetter === letter && <span style={{ fontSize: '10px', opacity: 0.8 }}>← jij</span>}
                </button>
              )
            })}
          </div>

          {/* Tips lijst */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {gefilterdeТips.map((tip, i) => {
              const type = typeIcoon[tip.type] || typeIcoon.artikel
              return (
                <a
                  key={i}
                  href={tip.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.12s, box-shadow 0.12s', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
                  >
                    {/* Type icoon */}
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: type.kleur, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                      {type.icoon}
                    </div>

                    {/* Titel */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: groenDark, marginBottom: '4px', lineHeight: '1.35' }}>
                        {tip.titel}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>
                        {type.label}
                      </div>
                    </div>

                    {/* Doelgroep symbolen */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {tip.doelgroepen.map((letter) => {
                        const d = doelgroepSymbolen[letter]
                        const isJij = letter === mijnLetter
                        return (
                          <div
                            key={letter}
                            title={d.label}
                            style={{
                              width: '28px', height: '28px',
                              borderRadius: '50%',
                              background: isJij ? groenDark : d.kleur,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.85rem',
                              border: isJij ? `2px solid ${groenDark}` : '1.5px solid rgba(0,0,0,0.08)',
                            }}
                          >
                            {d.icoon}
                          </div>
                        )
                      })}
                    </div>

                    <span style={{ color: groen, fontSize: '1.1rem', flexShrink: 0 }}>→</span>
                  </div>
                </a>
              )
            })}
          </div>

          {gefilterdeТips.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
              Geen tips gevonden voor dit filter.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TipsEnTools