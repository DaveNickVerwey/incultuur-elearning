import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import module1Foto from '../assets/module1.jpg'
import module2Foto from '../assets/module2.jpg'
import module3Foto from '../assets/module3.jpg'
import module4Foto from '../assets/module4.jpg'
import christineSunKim from '../assets/christine-sun-kim.webp'

const groen = '#00A99D'
const groenDark = '#1A3080'
const actieKleur = '#E67E22'       // warm oranje voor actie-scherm
const actieKleurDark = '#C05F0A'   // donker oranje voor koppen in actie-scherm
const actieAchtergrond = '#FFF8EC' // zachtgele achtergrond voor actie-scherm

const fotoMap = { 1: module1Foto, 2: module2Foto, 3: module3Foto, 4: module4Foto }

// Helper: render tekst met inline <strong>/<em> HTML én kader-klassen
const HTMLtekst = ({ tekst, style }) => (
  <div style={style} dangerouslySetInnerHTML={{ __html: tekst }} />
)

// Sub-stappen binnen "Kennis" - labels voor voortgang
const subStapLabels = [
  '1 van 4 · Introductie',
  '2 van 4 · Verdieping',
  '3 van 4 · Kosten & mensen',
  '4 van 4 · Afronding',
]

// CSS voor kaders (TIP / VOORBEELD / ONDERZOEK / RICHTLIJNEN) en voorbeeld-quote
const kaderCss = `
.kader {
  border-radius: 12px;
  padding: 1.15rem 1.3rem;
  margin: 1.25rem 0;
  border: 1px solid transparent;
  line-height: 1.7;
}
.kader p { margin: 0 0 0.6rem; font-size: 0.93rem; }
.kader p:last-child { margin: 0; }
.kader-label {
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
/* TIP — warm/geel */
.kader-tip { background: #FDF0DC; border-color: #f0d090; }
.kader-tip .kader-label { color: #7A4A05; }
.kader-tip p { color: #4a3208; }
/* VOORBEELD — teal/groen */
.kader-voorbeeld { background: #E0F5F4; border-color: #00A99D40; }
.kader-voorbeeld .kader-label { color: #006B63; }
.kader-voorbeeld p { color: #1a3a37; }
/* ONDERZOEK — paars */
.kader-onderzoek { background: #EFEDFC; border-color: #d4cff2; }
.kader-onderzoek .kader-label { color: #3D3280; }
.kader-onderzoek p { color: #2a2555; }
/* RICHTLIJNEN — blauw */
.kader-richtlijnen { background: #E6EEFF; border-color: #c5d1ef; }
.kader-richtlijnen .kader-label { color: #1A3080; }
.kader-richtlijnen p { color: #15245a; }
/* Opbrengst-paragraaf binnen rol-tekst */
p.opbrengst {
  background: #f0fafa;
  border-left: 3px solid #00A99D;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  margin-top: 1.25rem !important;
}
`

function Module() {
  const { nr } = useParams()
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [profiel, setProfiel] = useState(null)
  const [stap, setStap] = useState('intro')
  const [subStap, setSubStap] = useState(1)           // 1-4 binnen 'intro'
  const [reflectieSubStap, setReflectieSubStap] = useState(1) // 1-N binnen 'reflectie'
  const [reflecties, setReflecties] = useState({})
  const [actie, setActie] = useState('')
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [linkedInGekopieerd, setLinkedInGekopieerd] = useState(false)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const [disciplineOpen, setDisciplineOpen] = useState({})
  const [bronGroepOpen, setBronGroepOpen] = useState({})
  const [waarVandaanOpen, setWaarVandaanOpen] = useState(false)
  const navigate = useNavigate()

  const module = modulesData.find((m) => m.nr === parseInt(nr))

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

  const isPlaceholder = !module.intro
  const stappen = ['intro', 'reflectie', 'actie']
  const stapIndex = stappen.indexOf(stap)
  const aantalReflectieVragen = isPlaceholder ? 0 : module.reflectie.vragen.length
  const reflectiesIngevuld = !isPlaceholder && module.reflectie.vragen.every((v) => reflecties[v.id] && reflecties[v.id].trim().length > 10)
  const actieIngevuld = actie.trim().length > 5

  const huidigeReflectieVraag = !isPlaceholder ? module.reflectie.vragen[reflectieSubStap - 1] : null
  const huidigeReflectieIngevuld = huidigeReflectieVraag &&
    reflecties[huidigeReflectieVraag.id] &&
    reflecties[huidigeReflectieVraag.id].trim().length > 10

  const volgendeStap = () => {
    const next = stappen[stapIndex + 1]
    if (next) {
      setStap(next)
      if (next === 'reflectie') setReflectieSubStap(1)
      window.scrollTo(0, 0)
    }
  }
  const vorigeStap = () => {
    const prev = stappen[stapIndex - 1]
    if (prev) {
      setStap(prev)
      if (prev === 'reflectie') setReflectieSubStap(aantalReflectieVragen) // terug naar laatste vraag
      window.scrollTo(0, 0)
    }
  }

  // Sub-stap navigatie binnen 'intro'
  const volgendeSub = () => {
    if (subStap < 4) { setSubStap(subStap + 1); window.scrollTo(0, 0) }
    else { volgendeStap() }
  }
  const vorigeSub = () => {
    if (subStap > 1) { setSubStap(subStap - 1); window.scrollTo(0, 0) }
  }

  // Sub-stap navigatie binnen 'reflectie'
  const volgendeReflectie = () => {
    if (reflectieSubStap < aantalReflectieVragen) {
      setReflectieSubStap(reflectieSubStap + 1)
      window.scrollTo(0, 0)
    } else {
      volgendeStap()
    }
  }
  const vorigeReflectie = () => {
    if (reflectieSubStap > 1) {
      setReflectieSubStap(reflectieSubStap - 1)
      window.scrollTo(0, 0)
    } else {
      // Terug naar laatste sub-stap van kennis
      setStap('intro')
      setSubStap(4)
      window.scrollTo(0, 0)
    }
  }

  const gaNaarStap = (nieuweStap) => {
    setStap(nieuweStap)
    if (nieuweStap === 'intro') setSubStap(1)
    if (nieuweStap === 'reflectie') setReflectieSubStap(1)
    window.scrollTo(0, 0)
  }

  const handleAfgerond = async () => {
    if (!actieIngevuld) return
    const nieuweVoortgang = { ...voortgang, [module.nr]: true }
    const ref = doc(db, 'gebruikers', user.uid)
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

  const toggleDiscipline = (i) => setDisciplineOpen({ ...disciplineOpen, [i]: !disciplineOpen[i] })
  const toggleBron = (i) => setBronGroepOpen({ ...bronGroepOpen, [i]: !bronGroepOpen[i] })

  // Herbruikbare stijlen
  const h2 = { color: groenDark, fontSize: isMobiel ? '1.15rem' : '1.3rem', margin: '2rem 0 0.75rem', fontWeight: '700' }
  const paragraaf = { color: '#333', lineHeight: '1.75', fontSize: isMobiel ? '0.93rem' : '0.98rem', margin: '0 0 1rem' }

  // Navigatieknoppen onderaan sub-stappen binnen Kennis
  const SubNavigatie = ({ volgendeLabel }) => (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
      {subStap > 1 && (
        <button onClick={vorigeSub} style={{ padding: '0.9rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>
          ← Terug
        </button>
      )}
      <button onClick={volgendeSub} style={{ padding: '0.9rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', flex: isMobiel ? 2 : 'none' }}>
        {volgendeLabel} →
      </button>
    </div>
  )

  // Foto bovenaan een sub-stap
  const SubStapFoto = ({ nr }) => {
    const foto = module.intro.subStapFotos && module.intro.subStapFotos[nr - 1]
    if (!foto) return null
    return (
      <figure style={{ margin: '0 0 1.75rem', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <img src={foto.src} alt={foto.alt} style={{ width: '100%', height: isMobiel ? '220px' : '320px', objectFit: 'cover', display: 'block' }} />
        {foto.bijschrift && (
          <figcaption style={{ padding: '0.5rem 0.9rem', background: '#f6f6f4', fontSize: '0.72rem', color: '#666', lineHeight: '1.5', fontStyle: 'italic' }}>
            {foto.bijschrift}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: 'white' }}>
      {/* CSS voor kaders */}
      <style>{kaderCss}</style>

      <Sidebar actief={`module-${nr}`} voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', flex: 1, overflowX: 'hidden' }}>

        {/* Hero */}
        <div style={{ background: groenDark, padding: isMobiel ? '4rem 1.5rem 2rem' : '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${fotoMap[module.nr]})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '0.8rem', marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module {module.nr} · {module.duur}
            </p>
            <h1 style={{ color: 'white', fontSize: isMobiel ? '1.4rem' : '1.9rem', margin: '0 0 0.5rem', fontWeight: '700' }}>{module.titel}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>{module.subtitel}</p>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>
              {module.doelgroep}
            </div>
          </div>
        </div>

        {/* Placeholder scherm */}
        {isPlaceholder && (
          <div style={{ padding: isMobiel ? '2rem 1.25rem' : '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>🚧</p>
            <h2 style={{ color: groenDark, fontSize: '1.4rem', margin: '0 0 0.75rem' }}>Deze module wordt nog ontwikkeld</h2>
            <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '2rem' }}>
              We werken hard aan de inhoud van "{module.titel}". Ondertussen kun je alvast beginnen met de andere modules.
            </p>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '0.85rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>
              ← Terug naar dashboard
            </button>
          </div>
        )}

        {/* Stap tabs */}
        {!isPlaceholder && (
          <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 1.5rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
            {[
              { id: 'intro', label: '1. Kennis', kleur: groen, kleurDark: groenDark },
              { id: 'reflectie', label: '2. Reflectie', kleur: groen, kleurDark: groenDark },
              { id: 'actie', label: '3. Actie', kleur: actieKleur, kleurDark: actieKleurDark },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => gaNaarStap(s.id)}
                style={{
                  padding: '1rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: isMobiel ? '0.85rem' : '0.9rem',
                  fontWeight: stap === s.id ? '700' : '400',
                  color: stap === s.id ? s.kleurDark : '#444',
                  borderBottom: stap === s.id ? `2.5px solid ${s.kleur}` : '2.5px solid transparent',
                  whiteSpace: 'nowrap',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Actie-scherm krijgt zachtgele achtergrond zodat het visueel duidelijk verschilt */}
        {!isPlaceholder && (
        <div style={{
          padding: isMobiel ? '1.5rem 1.1rem' : '2.5rem',
          maxWidth: '780px',
          background: stap === 'actie' ? actieAchtergrond : 'white',
          minHeight: stap === 'actie' ? '80vh' : 'auto',
          transition: 'background 0.25s'
        }}>

          {/* ─────────── STAP 1: KENNIS (4 sub-stappen) ─────────── */}
          {stap === 'intro' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', color: groen, textTransform: 'uppercase' }}>
                    {subStapLabels[subStap - 1]}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} style={{ height: '3px', flex: 1, borderRadius: '2px', background: n <= subStap ? groen : '#e0e0e0', transition: 'background 0.3s' }} />
                  ))}
                </div>
              </div>

              {/* ══════════ SUB-STAP 1: INTRODUCTIE ══════════ */}
              {subStap === 1 && (
                <>
                  <SubStapFoto nr={1} />
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h2 style={{ margin: '0 0 0.25rem', color: groenDark, fontSize: isMobiel ? '1.3rem' : '1.5rem', fontWeight: '700', lineHeight: '1.2' }}>{module.intro.hero.titel}</h2>
                    <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>{module.doelgroep}</p>
                  </div>

                  <div style={{ background: '#f0fafa', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem', borderLeft: `4px solid ${groen}` }}>
                    {module.intro.hero.vragen.map((v, i) => (
                      <p key={i} style={{ margin: i < module.intro.hero.vragen.length - 1 ? '0 0 0.5rem' : 0, color: groenDark, fontSize: isMobiel ? '1rem' : '1.1rem', fontWeight: '600', lineHeight: '1.45', fontStyle: 'italic' }}>
                        {v}
                      </p>
                    ))}
                  </div>

                  {module.intro.secties.slice(0, 2).filter(Boolean).map((sectie, si) => (
                    <div key={si}>
                      <h2 style={h2}>{sectie.titel}</h2>
                      {sectie.alineas.map((al, ai) => (
                        <HTMLtekst key={ai} tekst={al} style={paragraaf} />
                      ))}
                    </div>
                  ))}

                  <SubNavigatie volgendeLabel="Volgende" />
                </>
              )}

              {/* ══════════ SUB-STAP 2: VERDIEPING + VOORBEELD ══════════ */}
              {subStap === 2 && (
                <>
                  <SubStapFoto nr={2} />
                  {module.intro.secties[2] && (
                    <div>
                      <h2 style={{ ...h2, marginTop: 0 }}>{module.intro.secties[2].titel}</h2>
                      {module.intro.secties[2].alineas.map((al, ai) => (
                        <HTMLtekst key={ai} tekst={al} style={paragraaf} />
                      ))}
                    </div>
                  )}

                  {/* Discipline uitklap */}
                  <h2 style={h2}>{module.intro.disciplineUitklap.titel}</h2>
                  <p style={{ ...paragraaf, color: '#555', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                    {module.intro.disciplineUitklap.subtitel}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    {module.intro.disciplineUitklap.items.map((item, i) => (
                      <div key={i} style={{ background: '#EFEDFC', borderRadius: '10px', border: '1px solid #d4cff2', overflow: 'hidden' }}>
                        <div onClick={() => toggleDiscipline(i)} style={{ padding: '0.85rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ flex: 1, fontSize: '0.92rem', color: '#3D3280', fontWeight: '600' }}>{item.titel}</div>
                          <span style={{ color: '#6B5ECC', fontSize: '1.2rem', fontWeight: '700' }}>{disciplineOpen[i] ? '−' : '+'}</span>
                        </div>
                        {disciplineOpen[i] && (
                          <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid rgba(107,94,204,0.2)' }}>
                            <HTMLtekst tekst={item.tekst} style={{ margin: '0.75rem 0 0.75rem', color: '#333', lineHeight: '1.7', fontSize: '0.88rem' }} />
                            <p style={{ margin: 0, color: '#6B5ECC', lineHeight: '1.6', fontSize: '0.82rem', fontStyle: 'italic', borderTop: '1px dashed rgba(107,94,204,0.3)', paddingTop: '0.75rem' }}>{module.intro.disciplineUitklap.afsluiter}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Uitgelicht voorbeeld (donkerblauwe gradient) */}
                  {module.intro.voorbeeld && (
                    <div style={{ background: 'linear-gradient(135deg, #1A3080 0%, #2A4090 100%)', borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem', color: 'white' }}>
                      {module.nr === 1 && (
                        <figure style={{ margin: 0 }}>
                          <img
                            src={christineSunKim}
                            alt="Christine Sun Kim staat in een tentoonstellingsruimte en maakt een gebaar in American Sign Language. Achter haar hangt een grote tekening van een cirkel verdeeld in taartpunten, met bovenaan de handgeschreven titel 'Shit hearing people say to me'. In elk taartpunt staat een uitspraak die horende mensen tegen haar hebben gezegd."
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                          <figcaption style={{ padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.35)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', fontStyle: 'italic' }}>
                            Christine Sun Kim bespreekt haar werk in het MIT List Visual Arts Center. Foto: Steven Davy / The World.
                          </figcaption>
                        </figure>
                      )}
                      <div style={{ padding: isMobiel ? '1.5rem' : '2rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: '700', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
                          Uitgelicht voorbeeld
                        </p>
                        <h3 style={{ color: 'white', fontSize: isMobiel ? '1.2rem' : '1.4rem', margin: '0 0 1rem', fontWeight: '700' }}>{module.intro.voorbeeld.titel.replace('Een voorbeeld dat de norm verlegt: ', '')}</h3>

                        {/* Uitgelichte quote als die er is */}
                        {module.intro.voorbeeld.quote && (
                          <blockquote style={{
                            margin: '0.5rem 0 1.5rem',
                            padding: isMobiel ? '0.75rem 0 0.75rem 1rem' : '0.75rem 0 0.75rem 1.25rem',
                            borderLeft: '3px solid rgba(255,255,255,0.5)',
                            fontSize: isMobiel ? '1.05rem' : '1.2rem',
                            fontStyle: 'italic',
                            color: 'white',
                            fontWeight: '500',
                            lineHeight: '1.4'
                          }}>
                            "{module.intro.voorbeeld.quote}"
                          </blockquote>
                        )}

                        {module.intro.voorbeeld.alineas.map((al, i) => (
                          <HTMLtekst key={i} tekst={al} style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.75', fontSize: isMobiel ? '0.9rem' : '0.95rem', margin: '0 0 1rem' }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <SubNavigatie volgendeLabel="Volgende: kosten & mensen" />
                </>
              )}

              {/* ══════════ SUB-STAP 3: KOSTEN & MENSEN ══════════ */}
              {subStap === 3 && (
                <>
                  <SubStapFoto nr={3} />
                  <h2 style={{ ...h2, marginTop: 0 }}>{module.intro.kostenSectie.titel}</h2>
                  <p style={paragraaf}>{module.intro.kostenSectie.intro}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {module.intro.kostenSectie.kosten.map((k, i) => (
                      <div key={i} style={{ background: '#f0fafa', borderRadius: '10px', padding: '1rem 1.1rem', borderLeft: `3px solid ${groen}` }}>
                        <div style={{ fontWeight: '700', color: groenDark, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{k.titel}</div>
                        <p style={{ margin: 0, color: '#444', fontSize: '0.85rem', lineHeight: '1.6' }}>{k.tekst}</p>
                      </div>
                    ))}
                  </div>
                  {module.intro.kostenSectie.waarVandaan.map((al, i) => (
                    <HTMLtekst key={i} tekst={al} style={paragraaf} />
                  ))}

                  {/* Uitklapper "Waar komt het geld vandaan" */}
                  {module.intro.kostenSectie.waarVandaanUitklap && (
                    <div style={{ background: '#EFEDFC', borderRadius: '10px', border: '1px solid #d4cff2', overflow: 'hidden', marginTop: '1rem', marginBottom: '1rem' }}>
                      <div onClick={() => setWaarVandaanOpen(!waarVandaanOpen)} style={{ padding: '0.85rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, fontSize: '0.92rem', color: '#3D3280', fontWeight: '600' }}>{module.intro.kostenSectie.waarVandaanUitklap.titel}</div>
                        <span style={{ color: '#6B5ECC', fontSize: '1.2rem', fontWeight: '700' }}>{waarVandaanOpen ? '−' : '+'}</span>
                      </div>
                      {waarVandaanOpen && (
                        <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid rgba(107,94,204,0.2)' }}>
                          {module.intro.kostenSectie.waarVandaanUitklap.alineas.map((al, i) => (
                            <HTMLtekst key={i} tekst={al} style={{ margin: '0.75rem 0 0', color: '#333', lineHeight: '1.7', fontSize: '0.88rem' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <SubNavigatie volgendeLabel="Volgende: afronding" />
                </>
              )}

              {/* ══════════ SUB-STAP 4: AFRONDING ══════════ */}
              {subStap === 4 && (
                <>
                  <SubStapFoto nr={4} />
                  {module.intro.diversiteitSectie && (
                    <>
                      <h2 style={{ ...h2, marginTop: 0 }}>{module.intro.diversiteitSectie.titel}</h2>
                      {module.intro.diversiteitSectie.alineas.map((al, i) => (
                        <HTMLtekst key={i} tekst={al} style={paragraaf} />
                      ))}
                    </>
                  )}

                  <h2 style={module.intro.diversiteitSectie ? h2 : { ...h2, marginTop: 0 }}>{module.intro.lessenSectie.titel}</h2>
                  <p style={paragraaf}>{module.intro.lessenSectie.intro}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {module.intro.lessenSectie.punten.map((p, i) => (
                      <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                        <div style={{ fontWeight: '700', color: groenDark, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{p.titel}</div>
                        <p style={{ margin: 0, color: '#333', lineHeight: '1.7', fontSize: '0.9rem' }}>{p.tekst}</p>
                      </div>
                    ))}
                  </div>

                  <h2 style={h2}>{module.intro.verderSectie.titel}</h2>
                  <p style={paragraaf}>{module.intro.verderSectie.intro}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                    {module.intro.verderSectie.punten.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>
                          {i + 1}
                        </div>
                        <HTMLtekst tekst={p} style={{ margin: 0, color: '#333', lineHeight: '1.7', fontSize: '0.92rem', flex: 1 }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#FDF0DC', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem', marginBottom: '1.5rem', border: '1px solid #f0d090' }}>
                    <p style={{ margin: '0 0 0.6rem', fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', color: '#7A4A05', textTransform: 'uppercase' }}>Denk hier even over na</p>
                    <p style={{ margin: 0, color: '#5a3a0a', lineHeight: '1.75', fontSize: isMobiel ? '0.92rem' : '0.98rem', fontStyle: 'italic' }}>{module.intro.denkVraag}</p>
                  </div>

                  {/* Bronnen */}
                  {module.bronnen && (
                    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid #eee' }}>
                      <h2 style={{ ...h2, marginTop: 0 }}>Bronnen & meer lezen</h2>
                      <p style={{ ...paragraaf, color: '#555', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{module.bronnen.intro}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {module.bronnen.groepen.map((groep, gi) => (
                          <div key={gi} style={{
                            background: groep.titel.toLowerCase().startsWith('handig') ? '#f0fafa' : '#f6f6f4',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: groep.titel.toLowerCase().startsWith('handig') ? `1.5px solid ${groen}40` : '1px solid transparent'
                          }}>
                            <div onClick={() => toggleBron(gi)} style={{ padding: '0.85rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ flex: 1, fontSize: '0.9rem', color: groenDark, fontWeight: groep.titel.toLowerCase().startsWith('handig') ? '700' : '600' }}>
                                {groep.titel.toLowerCase().startsWith('handig') && '⭐ '}{groep.titel}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#888' }}>{groep.items.length} bronnen</span>
                              <span style={{ color: groenDark, fontSize: '1.2rem', fontWeight: '700' }}>{bronGroepOpen[gi] ? '−' : '+'}</span>
                            </div>
                            {bronGroepOpen[gi] && (
                              <div style={{ padding: '0 0.6rem 0.6rem', borderTop: '1px solid #eee' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                  {groep.items.map((item, ii) => (
                                    <a key={ii} href={item.url} target="_blank" rel="noreferrer"
                                      style={{ color: groenDark, textDecoration: 'none', padding: '0.55rem 0.75rem', borderRadius: '6px', background: 'white', display: 'block' }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0fafa'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                      <div style={{ fontSize: '0.87rem', fontWeight: '600', marginBottom: '2px' }}>{item.titel}</div>
                                      <div style={{ fontSize: '0.76rem', color: '#666' }}>{item.bron} ↗</div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <SubNavigatie volgendeLabel="Naar reflectie op je werk" />
                </>
              )}
            </div>
          )}

          {/* ─────────── STAP 2: REFLECTIE (per vraag een eigen scherm) ─────────── */}
          {stap === 'reflectie' && huidigeReflectieVraag && (
            <div>
              {/* Voortgangsbalk per reflectie-sub-stap */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', color: groen, textTransform: 'uppercase' }}>
                    Vraag {reflectieSubStap} van {aantalReflectieVragen}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: aantalReflectieVragen }, (_, i) => i + 1).map((n) => (
                    <div key={n} style={{ height: '3px', flex: 1, borderRadius: '2px', background: n <= reflectieSubStap ? groen : '#e0e0e0', transition: 'background 0.3s' }} />
                  ))}
                </div>
              </div>

              <h2 style={{ color: '#1a1a1a', margin: '0 0 0.5rem', fontSize: isMobiel ? '1.3rem' : '1.5rem' }}>Reflecteer op je eigen werk</h2>
              {reflectieSubStap === 1 && (
                <p style={{ color: '#444', marginBottom: '2rem', lineHeight: '1.7', fontSize: '0.95rem' }}>{module.reflectie.intro}</p>
              )}

              {/* De huidige vraag */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: '700', flexShrink: 0 }}>
                    {reflectieSubStap}
                  </div>
                  <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: isMobiel ? '1.1rem' : '1.2rem', lineHeight: '1.4', fontWeight: '700' }}>{huidigeReflectieVraag.vraag}</h3>
                </div>
                {huidigeReflectieVraag.toelichting && (
                  <p style={{ margin: '0 0 1rem', color: '#555', fontSize: '0.88rem', lineHeight: '1.65', paddingLeft: '2px' }}>{huidigeReflectieVraag.toelichting}</p>
                )}
                <textarea
                  value={reflecties[huidigeReflectieVraag.id] || ''}
                  onChange={(e) => setReflecties({ ...reflecties, [huidigeReflectieVraag.id]: e.target.value })}
                  placeholder={huidigeReflectieVraag.placeholder}
                  rows={6}
                  style={{ width: '100%', padding: '0.85rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'system-ui, sans-serif', resize: 'vertical', lineHeight: '1.6', color: '#333', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = groen}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />

                {huidigeReflectieVraag.voorbeeldenBlok && (
                  <div style={{ marginTop: '1rem', background: '#f0fafa', borderRadius: '10px', padding: '1rem 1.1rem' }}>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#555', lineHeight: '1.55', fontStyle: 'italic' }}>{huidigeReflectieVraag.voorbeeldenBlok.intro}</p>
                    {huidigeReflectieVraag.voorbeeldenBlok.groepen.map((groep, gi) => (
                      <div key={gi} style={{ marginBottom: gi < huidigeReflectieVraag.voorbeeldenBlok.groepen.length - 1 ? '0.75rem' : 0 }}>
                        <div style={{ fontWeight: '700', color: groenDark, fontSize: '0.8rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{groep.titel}</div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#333', fontSize: '0.83rem', lineHeight: '1.7' }}>
                          {groep.items.map((it, ii) => (<li key={ii}>{it}</li>))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeReflectie} style={{ padding: '0.9rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button
                  onClick={volgendeReflectie}
                  disabled={!huidigeReflectieIngevuld}
                  style={{ padding: '0.9rem 2rem', background: huidigeReflectieIngevuld ? groen : '#bbb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: huidigeReflectieIngevuld ? 'pointer' : 'default', flex: isMobiel ? 2 : 'none' }}
                >
                  {reflectieSubStap < aantalReflectieVragen ? `Volgende vraag →` : 'Naar de actie-opdracht →'}
                </button>
              </div>
              {!huidigeReflectieIngevuld && <p style={{ color: '#555', fontSize: '0.82rem', marginTop: '0.6rem' }}>Beantwoord de vraag om verder te gaan.</p>}
            </div>
          )}

          {/* ─────────── STAP 3: ACTIE (eigen look, warm oranje thema) ─────────── */}
          {stap === 'actie' && (
            <div>
              {/* Eigen "oranje" banner bovenaan */}
              <div style={{
                background: `linear-gradient(135deg, ${actieKleur} 0%, ${actieKleurDark} 100%)`,
                borderRadius: '14px',
                padding: isMobiel ? '1.5rem 1.25rem' : '2rem',
                color: 'white',
                marginBottom: '1.75rem'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 0.5rem' }}>
                  Nu nog één ding
                </p>
                <h2 style={{ color: 'white', margin: '0 0 0.75rem', fontSize: isMobiel ? '1.4rem' : '1.65rem', fontWeight: '700', lineHeight: '1.2' }}>
                  Wat ga jij doen?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.95)', margin: 0, lineHeight: '1.6', fontSize: isMobiel ? '0.92rem' : '1rem' }}>
                  Kies één verandering die je bij je volgende activiteit uitprobeert. Maak die zo concreet mogelijk.
                </p>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.25rem', border: `2px solid ${actieKleur}30` }}>
                <p style={{ margin: '0 0 1rem', fontWeight: '700', color: actieKleurDark, fontSize: '1rem' }}>{module.actieOpdracht.prefix}...</p>
                <textarea
                  value={actie}
                  onChange={(e) => setActie(e.target.value)}
                  placeholder={module.actieOpdracht.placeholder}
                  rows={4}
                  style={{ width: '100%', padding: '0.85rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'system-ui, sans-serif', resize: 'vertical', lineHeight: '1.6', color: '#333', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = actieKleur}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.5rem', fontWeight: '600' }}>Voorbeelden:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {module.actieOpdracht.voorbeelden.map((vb, i) => (
                      <button key={i} onClick={() => setActie(vb)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: actieKleurDark, fontSize: '0.85rem', padding: '0.2rem 0', fontFamily: 'system-ui', textDecoration: 'underline' }}>
                        ...{vb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {actieIngevuld && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: `2px solid ${actieKleur}` }}>
                  <p style={{ margin: '0 0 1rem', fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.07em', color: actieKleurDark, textTransform: 'uppercase' }}>Bewaar je actie — kies wat bij je past</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button onClick={handleMailActie} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'white', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%' }}>
                      <span style={{ fontSize: '1.2rem' }}>✉️</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Stuur naar mijn e-mail</div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>Je actie als herinnering op {user?.email}</div>
                      </div>
                    </button>
                    <button onClick={handleAgendaActie} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'white', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%' }}>
                      <span style={{ fontSize: '1.2rem' }}>📅</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Plan in Google Agenda</div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>Agenda-item voor over een week — titel "InCultuur actie"</div>
                      </div>
                    </button>
                    <button onClick={handleLinkedIn} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: linkedInGekopieerd ? '#FFF2DF' : 'white', border: linkedInGekopieerd ? `1.5px solid ${actieKleur}` : '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontFamily: 'system-ui', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '1.2rem' }}>💼</span>
                      <div>
                        <div style={{ fontWeight: '600', color: linkedInGekopieerd ? actieKleurDark : '#333' }}>
                          {linkedInGekopieerd ? '✓ Tekst gekopieerd! Plak in LinkedIn' : 'Delen op LinkedIn'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#555' }}>
                          {linkedInGekopieerd ? 'LinkedIn opent zo — Cmd+V of Ctrl+V om te plakken' : 'Kopieert je tekst en opent LinkedIn'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.9rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button onClick={handleAfgerond} disabled={!actieIngevuld || opgeslagen} style={{ padding: '0.9rem 2rem', background: actieIngevuld && !opgeslagen ? actieKleur : '#bbb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: actieIngevuld && !opgeslagen ? 'pointer' : 'default', flex: isMobiel ? 2 : 'none' }}>
                  {opgeslagen ? '✓ Opgeslagen! Terug naar dashboard...' : 'Module afronden ✓'}
                </button>
              </div>
              {!actieIngevuld && <p style={{ color: '#555', fontSize: '0.82rem', marginTop: '0.6rem' }}>Vul je actie-opdracht in om de module af te ronden.</p>}
            </div>
          )}

        </div>
        )}
      </main>
    </div>
  )
}

export default Module
