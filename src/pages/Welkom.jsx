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

function berekenProfiel(antwoorden) {
  const totaal = Object.values(antwoorden).reduce((a, b) => a + b, 0)
  if (totaal <= 6) return 'Ontdekker'
  if (totaal <= 9) return 'Kijker'
  if (totaal <= 12) return 'Drempelverlager'
  return 'Voorloper'
}

function Welkom() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [huidigeVraag, setHuidigeVraag] = useState(0)
  const [antwoorden, setAntwoorden] = useState({})
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

  const handleAntwoord = async (score) => {
    const vraag = vragen[huidigeVraag]
    const nieuw = { ...antwoorden, [vraag.id]: score }
    setAntwoorden(nieuw)

    if (huidigeVraag < vragen.length - 1) {
      setHuidigeVraag(huidigeVraag + 1)
    } else {
      const profielType = berekenProfiel(nieuw)
      const ref = doc(db, 'gebruikers', user.uid)
      await setDoc(ref, { inCheckAntwoorden: nieuw, profielType }, { merge: true })
      navigate('/modules-uitleg')
    }
  }

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: isMobiel ? 'flex-start' : 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: isMobiel ? 0 : '2rem', background: groenDark, overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, background: 'white', borderRadius: isMobiel ? '0' : '16px', padding: isMobiel ? '2rem 1.5rem' : '3rem', maxWidth: '580px', width: '100%', boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)', minHeight: isMobiel ? '100vh' : 'auto' }}>

        {/* Voortgang dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', marginTop: isMobiel ? '2rem' : 0 }}>
          {vragen.map((_, i) => (
            <div key={i} style={{ height: '4px', flex: 1, borderRadius: '2px', background: i <= huidigeVraag ? groen : '#e0e0e0', transition: 'background 0.3s' }} />
          ))}
        </div>

        {huidigeVraag === 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: groen, fontWeight: '700', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              InCultuur InCheck
            </p>
            <h1 style={{ margin: '0 0 0.6rem', color: '#1a1a1a', fontSize: isMobiel ? '1.4rem' : '1.6rem' }}>
              Hoe kijk jij naar toegankelijkheid?
            </h1>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.65', margin: 0 }}>
              <strong>Geen toets. Geen goed of fout.</strong><br />
              Wel een korte check-in om te ontdekken waar jij nu staat — en welke nieuwe inzichten je onderweg misschien opdoet. In jouw profiel staat de uitslag.
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
              style={{ padding: '0.85rem 1.1rem', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: 'white', cursor: 'pointer', fontSize: '0.95rem', color: '#1a1a1a', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'system-ui, sans-serif' }}
              onMouseEnter={(e) => { e.target.style.borderColor = groen; e.target.style.background = '#E0F5F4' }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = 'white' }}
            >
              {optie.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Welkom