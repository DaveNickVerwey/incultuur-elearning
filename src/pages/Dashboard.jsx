import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import { IconCultuur, IconBereik, IconSamenwerking, IconMogelijkheden } from '../components/doelgroepIconen'
import module1Foto from '../assets/module1.jpg'
import module2Foto from '../assets/module2.jpg'
import module3Foto from '../assets/module3.jpg'
import module4Foto from '../assets/module4.jpg'

const groen = '#00A99D'
const groenDark = '#1A3080'

const moduleIconen = { 1: IconCultuur, 2: IconBereik, 3: IconSamenwerking, 4: IconMogelijkheden }
const fotoMap = { 1: module1Foto, 2: module2Foto, 3: module3Foto, 4: module4Foto }

const profielKleuren = {
  Ontdekker:       { bg: '#E0F5F4', tekst: groenDark, icoon: '🌱' },
  Kijker:          { bg: '#E8EFFE', tekst: groenDark, icoon: '👀' },
  Drempelverlager: { bg: '#EFEDFC', tekst: groenDark, icoon: '🚪' },
  Voorloper:       { bg: '#FDF0DC', tekst: '#7A4A05', icoon: '⭐' },
}

const feedbackVragen = [
  { id: 'beleving', vraag: 'Wat vond je van de module die je zojuist afgerond hebt?' },
  { id: 'leerervaring', vraag: 'Heb je het gevoel dat je iets geleerd hebt?' },
  { id: 'tips', vraag: 'Heb je nog tips of aanpassingen voor de Boost? Laat het weten!' },
]

function Dashboard() {
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [profiel, setProfiel] = useState(null)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const [toonFeedback, setToonFeedback] = useState(false)
  const [feedback, setFeedback] = useState({ beleving: '', leerervaring: '', tips: '' })
  const [feedbackVerstuurd, setFeedbackVerstuurd] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!user) return
    const haalData = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProfiel(snap.data())
        setVoortgang(snap.data().voortgang || {})
      }
    }
    haalData()
  }, [user])

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  const eersteModule = profiel.eersteModule || 1
  const allUnlocked = profiel.allUnlocked || false
  const afgerond = Object.values(voortgang).filter(Boolean).length
  const percentage = Math.round((afgerond / 4) * 100)

  const isUnlocked = (nr) => voortgang[nr] || allUnlocked || nr === eersteModule
  const isAfgerond = (nr) => !!voortgang[nr]
  const isEersteModule = (nr) => nr === eersteModule && !isAfgerond(nr)

  const profielType = profiel.profielType
  const profielKleur = profielKleuren[profielType]

  const handleUnlockAlles = async () => {
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { allUnlocked: true, moduleFeedback: feedback }, { merge: true })
    setProfiel({ ...profiel, allUnlocked: true })
    setToonFeedback(false)
    setFeedbackVerstuurd(true)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="dashboard" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1 }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#1a1a1a', margin: '0 0 0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>
            Hallo, {profiel.naam}!
          </h1>
          <p style={{ color: '#444', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
            {afgerond === 0 ? 'Ga verder waar je gebleven bent' : afgerond === 4 ? 'Je hebt alle modules afgerond. Indrukwekkend!' : `Je hebt ${afgerond} van de 4 modules afgerond. Goed bezig!`}
          </p>
        </div>

        {profielType && profielKleur && (
          <div style={{ background: profielKleur.bg, border: `1px solid ${profielKleur.tekst}25`, borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{profielKleur.icoon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: profielKleur.tekst, marginBottom: '2px', textTransform: 'uppercase' }}>Jouw InCheck profiel</div>
              <div style={{ fontWeight: '600', color: profielKleur.tekst, fontSize: '0.95rem' }}>{profielType}</div>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.88rem', color: '#333', fontWeight: '500' }}>Voortgang</span>
            <span style={{ fontWeight: '700', color: groenDark, fontSize: '0.95rem' }}>{percentage}%</span>
          </div>
          <div style={{ height: '6px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: groen, borderRadius: '4px', width: `${percentage}%`, transition: 'width 0.4s' }} />
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#555' }}>{afgerond} van 4 modules voltooid</div>
        </div>

        {afgerond >= 1 && !allUnlocked && !toonFeedback && (
          <div style={{ background: groenDark, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎉</span>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: '0 0 0.4rem', fontSize: '0.95rem' }}>Je hebt jouw eerste module afgerond!</p>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 0.75rem', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Toegankelijkheid is breder dan jouw rol alleen. Ontdek nu ook hoe je collega's het aanpakken — en hoe alle puzzelstukjes samenkomen.
              </p>
              <button onClick={() => setToonFeedback(true)} style={{ padding: '0.6rem 1.25rem', background: 'white', color: groenDark, border: 'none', borderRadius: '8px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer' }}>
                Ontgrendel alle modules →
              </button>
            </div>
          </div>
        )}

        {toonFeedback && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', borderLeft: `4px solid ${groen}` }}>
            <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.1rem' }}>Voordat je verdergaat... 💬</h2>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>We zijn benieuwd naar jouw ervaring. Je antwoorden helpen ons de InCultuur Boost te verbeteren.</p>
            {feedbackVragen.map((vraag, i) => (
              <div key={vraag.id} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>{i + 1}. {vraag.vraag}</label>
                <textarea value={feedback[vraag.id]} onChange={(e) => setFeedback({ ...feedback, [vraag.id]: e.target.value })} rows={3} placeholder="Jouw antwoord..." style={{ width: '100%', padding: '0.75rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.92rem', fontFamily: 'system-ui, sans-serif', resize: 'vertical', lineHeight: '1.6', color: '#333', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = groen} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => setToonFeedback(false)} style={{ padding: '0.8rem 1.5rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>← Terug</button>
              <button onClick={handleUnlockAlles} style={{ padding: '0.8rem 1.5rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>Verstuur & ontgrendel alle modules →</button>
            </div>
          </div>
        )}

        {feedbackVerstuurd && (
          <div style={{ background: '#E0F5F4', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>✅</span>
            <p style={{ margin: 0, color: groenDark, fontWeight: '600', fontSize: '0.9rem' }}>Bedankt voor je feedback! Alle modules zijn nu beschikbaar.</p>
          </div>
        )}

        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: '#595959', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Modules</div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {modulesData.map((module) => {
            const unlocked = isUnlocked(module.nr)
            const afgerondStatus = isAfgerond(module.nr)
            const isFirst = isEersteModule(module.nr)
            const isAndere = !isFirst && !afgerondStatus && unlocked
            const Icoon = moduleIconen[module.nr]

            return (
              <div
                key={module.nr}
                onClick={() => unlocked && navigate(`/module/${module.nr}`)}
                style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: unlocked ? 'pointer' : 'default', background: 'white', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)' }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Foto met overlay */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={fotoMap[module.nr]}
                    alt={module.titel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: !unlocked ? 'grayscale(80%)' : 'none' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: afgerondStatus ? 'rgba(26,48,128,0.6)' : !unlocked ? 'rgba(0,0,0,0.5)' : 'rgba(26,48,128,0.25)',
                  }} />

                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    {afgerondStatus && <span style={{ background: groen, color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700' }}>✓ Voltooid</span>}
                    {isFirst && <span style={{ background: 'white', color: groenDark, padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700' }}>Jouw module</span>}
                    {isAndere && <span style={{ background: 'rgba(255,255,255,0.9)', color: '#333', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>Ook interessant</span>}
                    {!unlocked && <span style={{ background: 'rgba(0,0,0,0.55)', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem' }}>🔒 Vergrendeld</span>}
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(0,0,0,0.45)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600' }}>
                    Module {module.nr}
                  </div>
                </div>

                {/* Body met groot icoon links */}
                <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Groot icoon */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#E0F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: groenDark, flexShrink: 0 }}>
                    <Icoon size={32} stroke={1.6} />
                  </div>

                  {/* Tekst */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ margin: '0 0 0.2rem', color: '#1a1a1a', fontSize: '1.05rem', fontWeight: '700', lineHeight: '1.25' }}>{module.titel}</h2>
                    <p style={{ margin: '0 0 0.4rem', color: '#444', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: '1.4' }}>{module.subtitel}</p>
                    <p style={{ margin: '0 0 0.6rem', color: '#666', fontSize: '0.78rem', lineHeight: '1.5' }}>{module.doelgroep}</p>
                    <div style={{ height: '3px', background: '#ddd', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: groen, width: afgerondStatus ? '100%' : '0%', borderRadius: '2px', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderLeft: `4px solid ${groen}` }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#1a1a1a', fontSize: '1rem' }}>Word onderdeel van de InCultuur Community</h3>
          <p style={{ margin: '0 0 0.75rem', color: '#444', fontSize: '0.88rem', lineHeight: '1.65' }}>
            Binnen de community werken culturele organisaties, makers, professionals en ervaringsdeskundigen samen aan een toegankelijkere en inclusievere Haagse cultuursector.
          </p>
          <a href="mailto:contact@incultuur.nl" style={{ color: groen, fontWeight: '600', fontSize: '0.88rem', textDecoration: 'none' }}>contact@incultuur.nl →</a>
        </div>

      </main>
    </div>
  )
}

export default Dashboard