import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import { IconCultuur, IconBereik, IconSamenwerking, IconMogelijkheden } from '../components/doelgroepIconen'

const groen = '#00A99D'
const groenDark = '#1A3080'

const moduleIconen = { 1: IconCultuur, 2: IconBereik, 3: IconSamenwerking, 4: IconMogelijkheden }

function Module() {
  const { nr } = useParams()
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [profiel, setProfiel] = useState(null)
  const [stap, setStap] = useState('intro')
  const [reflecties, setReflecties] = useState({})
  const [actie, setActie] = useState('')
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [linkedInGekopieerd, setLinkedInGekopieerd] = useState(false)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  const module = modulesData.find((m) => m.nr === parseInt(nr))
  const ModuleIcoon = moduleIconen[parseInt(nr)]

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
        const data = snap.data()
        setVoortgang(data.voortgang || {})
        setProfiel(data)
        setReflecties(data[`reflecties_${nr}`] || {})
        setActie(data[`actie_${nr}`] || '')
      }
    }
    haal()
  }, [user, nr])

  if (!module) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Module niet gevonden</div>

  const stappen = ['intro', 'reflectie', 'actie']
  const stapIndex = stappen.indexOf(stap)
  const reflectiesIngevuld = module.reflectieVragen.every((v) => reflecties[v.id] && reflecties[v.id].trim().length > 10)
  const actieIngevuld = actie.trim().length > 5

  const volgendeStap = () => { const next = stappen[stapIndex + 1]; if (next) { setStap(next); window.scrollTo(0, 0) } }
  const vorigeStap = () => { const prev = stappen[stapIndex - 1]; if (prev) { setStap(prev); window.scrollTo(0, 0) } }

  const handleAfgerond = async () => {
    if (!actieIngevuld) return
    const nieuweVoortgang = { ...voortgang, [module.nr]: true }
    const ref = doc(db, 'gebruikers', user.uid)
    const alleAfgerond = Object.keys(nieuweVoortgang).length === 4
    await setDoc(ref, { voortgang: nieuweVoortgang, [`reflecties_${nr}`]: reflecties, [`actie_${nr}`]: actie }, { merge: true })
    setVoortgang(nieuweVoortgang)
    setOpgeslagen(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const volledigeActie = `${module.actieOpdracht.prefix} ${actie}`

  const handleMailActie = () => {
    const onderwerp = encodeURIComponent(`Mijn actie – InCultuur Boost Module ${module.nr}`)
    const body = encodeURIComponent(`Hallo,\n\nIk heb Module ${module.nr} (${module.titel}) van de InCultuur Boost afgerond.\n\nMijn actie:\n${volledigeActie}\n\nSucces!`)
    window.location.href = `mailto:${user.email}?subject=${onderwerp}&body=${body}`
  }

  const handleAgendaActie = () => {
    const overEenWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const titel = encodeURIComponent('InCultuur actie')
    const details = encodeURIComponent(`Mijn actie uit Module ${module.nr} (${module.titel}):\n\n${volledigeActie}`)
    const start = formatDate(overEenWeek)
    const end = formatDate(new Date(overEenWeek.getTime() + 60 * 60 * 1000))
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titel}&details=${details}&dates=${start}/${end}`, '_blank')
  }

  const handleLinkedIn = () => {
    const tekst = `Vandaag heb ik de InCultuur Boost gedaan over toegankelijkheid en inclusie in de cultuursector.\n\nMijn actie: "${volledigeActie}"\n\n#incultuur #toegankelijkheid #kunstencultuur #denhaag`
    navigator.clipboard.writeText(tekst).then(() => {
      setLinkedInGekopieerd(true)
      setTimeout(() => setLinkedInGekopieerd(false), 4000)
      setTimeout(() => window.open('https://www.linkedin.com/feed/', '_blank'), 400)
    }).catch(() => window.open('https://www.linkedin.com/feed/', '_blank'))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: 'white' }}>
      <Sidebar actief={`module-${nr}`} voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', flex: 1, overflowX: 'hidden' }}>

        {/* Hero met icoon */}
        <div style={{ background: groenDark, padding: isMobiel ? '4rem 1.5rem 2rem' : '3rem 2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {ModuleIcoon && (
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <ModuleIcoon size={32} stroke={1.6} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '0.78rem', marginBottom: '0.3rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Module {module.nr} · {module.duur}
              </p>
              <h1 style={{ color: 'white', fontSize: isMobiel ? '1.35rem' : '1.75rem', margin: 0, fontWeight: '700', lineHeight: '1.2' }}>
                {module.titel}
              </h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>{module.subtitel}</p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
            {module.doelgroep}
          </div>
        </div>

        {/* Stap tabs */}
        <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 1.5rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {[
            { id: 'intro', label: '1. Introductie' },
            { id: 'reflectie', label: '2. Kijk naar je werk' },
            { id: 'actie', label: '3. Aan de slag' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => { setStap(s.id); window.scrollTo(0, 0) }}
              style={{ padding: '1rem 0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: isMobiel ? '0.8rem' : '0.88rem', fontWeight: stap === s.id ? '700' : '400', color: stap === s.id ? groenDark : '#444', borderBottom: stap === s.id ? `2.5px solid ${groen}` : '2.5px solid transparent', whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif' }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ padding: isMobiel ? '1.5rem 1.1rem' : '2.5rem', maxWidth: '760px' }}>

          {/* STAP 1: INTRO */}
          {stap === 'intro' && (
            <div>
              <div style={{ background: '#f0fafa', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', borderLeft: `4px solid ${groen}` }}>
                {module.intro.split('\n\n').map((alinea, i) => (
                  <p key={i} style={{ margin: i < module.intro.split('\n\n').length - 1 ? '0 0 1rem' : 0, lineHeight: '1.8', color: '#333', fontSize: isMobiel ? '0.92rem' : '1rem' }}>
                    {alinea}
                  </p>
                ))}
              </div>

              <div style={{ background: '#FDF0DC', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #f0d090' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', color: '#7A4A05', textTransform: 'uppercase' }}>Denk hier even over na</p>
                <p style={{ margin: 0, color: '#5a3a0a', lineHeight: '1.7', fontSize: isMobiel ? '0.92rem' : '0.98rem', fontStyle: 'italic' }}>{module.denkVraag}</p>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '2rem' }}>
                <h3 style={{ color: '#1a1a1a', margin: '0 0 1rem', fontSize: '1rem' }}>Na deze module kun je...</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {module.leerdoelen.map((doel, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: groen, fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>✓</span>
                      <span style={{ color: '#333', fontSize: isMobiel ? '0.9rem' : '0.95rem', lineHeight: '1.5' }}>{doel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={volgendeStap} style={{ padding: '0.9rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
                Kijk naar je eigen werk →
              </button>
            </div>
          )}

          {/* STAP 2: REFLECTIE */}
          {stap === 'reflectie' && (
            <div>
              <h2 style={{ color: '#1a1a1a', margin: '0 0 0.5rem', fontSize: isMobiel ? '1.2rem' : '1.4rem' }}>Kijk naar je eigen werk</h2>
              <p style={{ color: '#444', marginBottom: '2rem', lineHeight: '1.65', fontSize: '0.95rem' }}>
                Kies een voorstelling, concert, expositie, evenement of (les)programma waar jij aan werkt. Of kort geleden aan hebt gewerkt. Beantwoord deze 3 vragen — er zijn geen goede of foute antwoorden.
              </p>

              {module.reflectieVragen.map((vraag, i) => (
                <div key={vraag.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: '700', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: isMobiel ? '0.95rem' : '1rem', lineHeight: '1.4', fontWeight: '600' }}>{vraag.vraag}</h3>
                  </div>
                  {vraag.toelichting && (
                    <p style={{ margin: '0 0 0.75rem', color: '#555', fontSize: '0.85rem', lineHeight: '1.6', paddingLeft: '2px' }}>{vraag.toelichting}</p>
                  )}
                  <textarea
                    value={reflecties[vraag.id] || ''}
                    onChange={(e) => setReflecties({ ...reflecties, [vraag.id]: e.target.value })}
                    placeholder={vraag.placeholder}
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.92rem', fontFamily: 'system-ui, sans-serif', resize: 'vertical', lineHeight: '1.6', color: '#333', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = groen}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.9rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button onClick={volgendeStap} disabled={!reflectiesIngevuld} style={{ padding: '0.9rem 2rem', background: reflectiesIngevuld ? groen : '#bbb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: reflectiesIngevuld ? 'pointer' : 'default', flex: isMobiel ? 2 : 'none' }}>
                  Naar de actie-opdracht →
                </button>
              </div>
              {!reflectiesIngevuld && <p style={{ color: '#555', fontSize: '0.82rem', marginTop: '0.6rem' }}>Beantwoord alle drie de vragen om verder te gaan.</p>}
            </div>
          )}

          {/* STAP 3: ACTIE */}
          {stap === 'actie' && (
            <div>
              <h2 style={{ color: '#1a1a1a', margin: '0 0 0.5rem', fontSize: isMobiel ? '1.2rem' : '1.4rem' }}>Actie-opdracht</h2>
              <p style={{ color: '#444', marginBottom: '1.5rem', lineHeight: '1.65', fontSize: '0.95rem' }}>Kies één concrete verbetering die jij kunt doorvoeren. Maak hem zo specifiek mogelijk.</p>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 1rem', fontWeight: '600', color: '#1a1a1a', fontSize: '0.95rem' }}>{module.actieOpdracht.prefix}</p>
                <textarea
                  value={actie}
                  onChange={(e) => setActie(e.target.value)}
                  placeholder={module.actieOpdracht.placeholder}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'system-ui, sans-serif', resize: 'vertical', lineHeight: '1.6', color: '#333', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.4rem' }}>Voorbeelden:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {module.actieOpdracht.voorbeelden.map((vb, i) => (
                      <button key={i} onClick={() => setActie(vb)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: groen, fontSize: '0.82rem', padding: '0.2rem 0', fontFamily: 'system-ui', textDecoration: 'underline' }}>
                        {module.actieOpdracht.prefix} {vb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {actieIngevuld && (
                <div style={{ background: '#f0fafa', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: `1px solid ${groen}40` }}>
                  <p style={{ margin: '0 0 1rem', fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', color: groenDark, textTransform: 'uppercase' }}>Wat doe je met je actie?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button onClick={handleMailActie} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'white', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%' }}>
                      <span style={{ fontSize: '1.2rem' }}>✉️</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Stuur actie naar mijn e-mail</div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>Je ontvangt je actie als herinnering op {user?.email}</div>
                      </div>
                    </button>
                    <button onClick={handleAgendaActie} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'white', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%' }}>
                      <span style={{ fontSize: '1.2rem' }}>📅</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Zet in Google Agenda</div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>Opent Google Agenda met je actie al ingevuld — voor over een week</div>
                      </div>
                    </button>
                    <button onClick={handleLinkedIn} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: linkedInGekopieerd ? '#E0F5F4' : 'white', border: linkedInGekopieerd ? `1.5px solid ${groen}` : '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '1.2rem' }}>💼</span>
                      <div>
                        <div style={{ fontWeight: '600', color: linkedInGekopieerd ? groenDark : '#333' }}>
                          {linkedInGekopieerd ? '✓ Tekst gekopieerd! Plak in LinkedIn' : 'Delen op LinkedIn'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>
                          {linkedInGekopieerd ? 'LinkedIn opent zo — druk Cmd+V of Ctrl+V om te plakken' : 'Kopieert je tekst automatisch en opent LinkedIn'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.9rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button onClick={handleAfgerond} disabled={!actieIngevuld || opgeslagen} style={{ padding: '0.9rem 2rem', background: actieIngevuld && !opgeslagen ? groen : '#bbb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: actieIngevuld && !opgeslagen ? 'pointer' : 'default', flex: isMobiel ? 2 : 'none' }}>
                  {opgeslagen ? '✓ Opgeslagen! Terug naar dashboard...' : 'Module afronden ✓'}
                </button>
              </div>
              {!actieIngevuld && <p style={{ color: '#555', fontSize: '0.82rem', marginTop: '0.6rem' }}>Vul je actie-opdracht in om de module af te ronden.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Module