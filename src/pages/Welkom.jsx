import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'

const groen = '#00A99D'
const groenDark = '#1A3080'

const vragen = [
  {
    id: 'kennis',
    vraag: 'Hoeveel weet jij volgens jezelf over toegankelijkheid?',
    opties: [
      { label: 'Ik begin net', score: 1 },
      { label: 'Ik weet er wel iets van', score: 2 },
      { label: 'Ik houd er soms rekening mee', score: 3 },
      { label: 'Ik werk er actief mee', score: 4 },
      { label: 'Ik zie mezelf als expert', score: 5 },
    ],
  },
  {
    id: 'associatie',
    vraag: 'Waar denk jij als eerste aan bij toegankelijkheid?',
    opties: [
      { label: 'Rolstoeltoegang', score: 1 },
      { label: 'Ondertiteling of gebarentaal', score: 2 },
      { label: 'Prikkelarme omgeving', score: 3 },
      { label: 'Betaalbaarheid', score: 2 },
      { label: 'Iedereen welkom laten voelen', score: 4 },
      { label: 'Anders / weet ik niet precies', score: 1 },
    ],
  },
  {
    id: 'frequentie',
    vraag: 'Hoe vaak denk jij aan toegankelijkheid in je werk?',
    opties: [
      { label: 'Bijna nooit', score: 1 },
      { label: 'Soms achteraf', score: 2 },
      { label: 'Alleen als iemand erom vraagt', score: 2 },
      { label: 'Regelmatig', score: 3 },
      { label: 'Vanaf het eerste idee', score: 5 },
    ],
  },
]

const profielTypes = [
  {
    type: 'Ontdekker',
    minScore: 3, maxScore: 6,
    omschrijving: 'Je staat aan het begin van je toegankelijkheidsreis.',
    detail: 'Nieuwsgierigheid is de beste start. De InCultuur Boost helpt je ontdekken wat toegankelijkheid écht betekent — en hoe jij al klein verschil kunt maken.',
    icoon: '🌱', kleur: '#E0F5F4', tekstKleur: '#1A3080',
  },
  {
    type: 'Kijker',
    minScore: 7, maxScore: 9,
    omschrijving: 'Je ziet al dat toegankelijkheid belangrijk is.',
    detail: 'Je ontdekt steeds meer details. Met de InCultuur Boost ga je van bewustzijn naar concrete stappen in jouw dagelijkse werk.',
    icoon: '👀', kleur: '#E8EFFE', tekstKleur: '#1A3A72',
  },
  {
    type: 'Drempelverlager',
    minScore: 10, maxScore: 12,
    omschrijving: 'Je houdt actief rekening met toegankelijkheid.',
    detail: 'Je maakt al verschil in je werk. De InCultuur Boost geeft je nieuwe handvatten en verdiept je aanpak — zodat je nóg meer impact hebt.',
    icoon: '🚪', kleur: '#EFEDFC', tekstKleur: '#3D3280',
  },
  {
    type: 'Voorloper',
    minScore: 13, maxScore: 15,
    omschrijving: 'Toegankelijkheid zit al stevig in jouw denken en doen.',
    detail: 'Nu kun je anderen inspireren. De InCultuur Boost helpt je om je kennis te verbreden en jouw aanpak te delen met collega\'s.',
    icoon: '⭐', kleur: '#FDF0DC', tekstKleur: '#7A4A05',
  },
]

function berekenProfiel(antwoorden) {
  const totalScore = Object.values(antwoorden).reduce((acc, score) => acc + score, 0)
  return profielTypes.find((p) => totalScore >= p.minScore && totalScore <= p.maxScore) || profielTypes[0]
}

function Welkom() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [huidigeVraag, setHuidigeVraag] = useState(0)
  const [antwoorden, setAntwoorden] = useState({})
  const [resultaat, setResultaat] = useState(null)
  const isMobiel = window.innerWidth < 768
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haal()
  }, [user])

  const handleAntwoord = async (score) => {
    const vraag = vragen[huidigeVraag]
    const nieuweAntwoorden = { ...antwoorden, [vraag.id]: score }
    setAntwoorden(nieuweAntwoorden)

    if (huidigeVraag < vragen.length - 1) {
      setHuidigeVraag(huidigeVraag + 1)
    } else {
      const profielType = berekenProfiel(nieuweAntwoorden)
      setResultaat(profielType)
      const ref = doc(db, 'gebruikers', user.uid)
      await setDoc(ref, { inCheckAntwoorden: nieuweAntwoorden, profielType: profielType.type, welkomGezien: true }, { merge: true })
    }
  }

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: isMobiel ? 'flex-start' : 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: isMobiel ? 0 : '2rem',
      background: '#1A3080',
      overflow: 'hidden',
    }}>
      {/* Theater achtergrond */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${theaterFoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'white',
        borderRadius: isMobiel ? '0' : '16px',
        padding: isMobiel ? '2rem 1.5rem' : '3rem',
        maxWidth: '580px',
        width: '100%',
        boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)',
        minHeight: isMobiel ? '100vh' : 'auto',
      }}>

        {!resultaat ? (
          <>
            {/* Voortgang dots */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', marginTop: isMobiel ? '2rem' : 0 }}>
              {vragen.map((_, i) => (
                <div key={i} style={{
                  height: '4px', flex: 1, borderRadius: '2px',
                  background: i <= huidigeVraag ? groen : '#e0e0e0',
                  opacity: i === huidigeVraag ? 1 : i < huidigeVraag ? 0.6 : 1,
                  transition: 'background 0.3s'
                }} />
              ))}
            </div>

            {huidigeVraag === 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ margin: '0 0 0.5rem', color: '#1a1a1a', fontSize: isMobiel ? '1.4rem' : '1.6rem' }}>
                  Hi {profiel.naam}, fijn dat je er bent! 👋
                </h1>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.65', margin: 0 }}>
                  Voordat je begint: hoe kijk jij eigenlijk naar toegankelijkheid?<br />
                  <strong>Geen toets, geen goed of fout</strong> — wel een korte check-in om te ontdekken waar jij nu staat.
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                VRAAG {huidigeVraag + 1} VAN {vragen.length}
              </div>
              <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: isMobiel ? '1.1rem' : '1.2rem', lineHeight: '1.4', fontWeight: '600' }}>
                {vragen[huidigeVraag].vraag}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {vragen[huidigeVraag].opties.map((optie, i) => (
                <button
                  key={i}
                  onClick={() => handleAntwoord(optie.score)}
                  style={{
                    padding: '0.85rem 1.1rem',
                    border: '1.5px solid #e0e0e0',
                    borderRadius: '10px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: '#1a1a1a',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    fontFamily: 'system-ui, sans-serif',
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = groen; e.target.style.background = '#E0F5F4' }}
                  onMouseLeave={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = 'white' }}
                >
                  {optie.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Resultaat */
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: isMobiel ? '2rem' : 0 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{resultaat.icoon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', color: '#888', marginBottom: '0.5rem' }}>
                JOUW IN-CHECK PROFIEL
              </div>
              <h1 style={{ margin: '0 0 0.4rem', color: '#1a1a1a', fontSize: isMobiel ? '1.6rem' : '1.8rem' }}>
                Jij bent een <span style={{ color: resultaat.tekstKleur }}>{resultaat.type}</span>
              </h1>
            </div>

            <div style={{ background: resultaat.kleur, borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: `1px solid ${resultaat.tekstKleur}30` }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: resultaat.tekstKleur, fontSize: '1rem' }}>
                {resultaat.omschrijving}
              </p>
              <p style={{ margin: 0, color: '#444', fontSize: '0.9rem', lineHeight: '1.65' }}>
                {resultaat.detail}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.07em', color: '#888', marginBottom: '0.75rem' }}>
                DE VIER PROFIELEN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {profielTypes.map((p) => (
                  <div key={p.type} style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: p.type === resultaat.type ? p.kleur : '#f9f9f9',
                    border: p.type === resultaat.type ? `1.5px solid ${p.tekstKleur}40` : '1px solid #eee',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{p.icoon}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: p.type === resultaat.type ? '700' : '400', color: p.type === resultaat.type ? p.tekstKleur : '#555' }}>
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              style={{ width: '100%', padding: '1rem', background: groen, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Klaar voor de Boost! →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Welkom