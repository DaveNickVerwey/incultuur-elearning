import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import module1Foto from '../assets/module1.jpg'
import module2Foto from '../assets/module2.jpg'
import module3Foto from '../assets/module3.jpg'
import module4Foto from '../assets/module4.jpg'

const groen = '#00A99D'
const groenDark = '#1A3080'

const fotoMap = { 1: module1Foto, 2: module2Foto, 3: module3Foto, 4: module4Foto }

const profielKleuren = {
  Ontdekker:       { bg: '#E0F5F4', tekst: '#1A3080', icoon: '🌱' },
  Kijker:          { bg: '#E8EFFE', tekst: '#1A3A72', icoon: '👀' },
  Drempelverlager: { bg: '#EFEDFC', tekst: '#3D3280', icoon: '🚪' },
  Voorloper:       { bg: '#FDF0DC', tekst: '#7A4A05', icoon: '⭐' },
}

function Dashboard() {
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [profiel, setProfiel] = useState(null)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
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

  const isUnlocked = (nr) => {
    if (voortgang[nr]) return true
    if (allUnlocked) return true
    if (nr === eersteModule) return true
    return false
  }

  const isAfgerond = (nr) => !!voortgang[nr]
  const isEersteModule = (nr) => nr === eersteModule && !isAfgerond(nr)

  const profielType = profiel.profielType
  const profielKleur = profielKleuren[profielType]

  const handleUnlockAlles = async () => {
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { allUnlocked: true }, { merge: true })
    setProfiel({ ...profiel, allUnlocked: true })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="dashboard" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1 }}>

        {/* Welkomst */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#1a1a1a', margin: '0 0 0.4rem', fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>
            Hallo, {profiel.naam}!
          </h1>
          <p style={{ color: '#444', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
            {afgerond === 0
              ? 'Ga verder waar je gebleven bent'
              : afgerond === 4
              ? 'Je hebt alle modules afgerond. Indrukwekkend!'
              : `Je hebt ${afgerond} van de 4 modules afgerond. Goed bezig!`}
          </p>
        </div>

        {/* Profiel type badge */}
        {profielType && profielKleur && (
          <div style={{
            background: profielKleur.bg,
            border: `1px solid ${profielKleur.tekst}25`,
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>{profielKleur.icoon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: profielKleur.tekst, marginBottom: '2px', textTransform: 'uppercase' }}>
                Jouw In-Check profiel
              </div>
              <div style={{ fontWeight: '600', color: profielKleur.tekst, fontSize: '0.95rem' }}>
                {profielType}
              </div>
            </div>
          </div>
        )}

        {/* Voortgang */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.88rem', color: '#333', fontWeight: '500' }}>Voortgang</span>
            <span style={{ fontWeight: '700', color: '#1A3080', fontSize: '0.95rem' }}>{percentage}%</span>
          </div>
          <div style={{ height: '6px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: groen, borderRadius: '4px', width: `${percentage}%`, transition: 'width 0.4s' }} />
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#555' }}>
            {afgerond} van 4 modules voltooid
          </div>
        </div>

        {/* Aanmoediging na eerste module — alleen tonen als nog niet alle modules unlocked */}
        {afgerond >= 1 && !allUnlocked && (
          <div style={{
            background: '#1A3080',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎉</span>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: '0 0 0.4rem', fontSize: '0.95rem' }}>
                Je hebt jouw eerste module afgerond!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 0.75rem', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Toegankelijkheid is breder dan jouw rol alleen. Ontdek nu ook hoe je collega's het aanpakken — en hoe alle puzzelstukjes samenkomen.
              </p>
              <button
                onClick={handleUnlockAlles}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: 'white',
                  color: '#1A3080',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Ontgrendel alle modules →
              </button>
            </div>
          </div>
        )}

        {/* Module grid */}
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: '#595959', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Modules
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
          {modulesData.map((module) => {
            const unlocked = isUnlocked(module.nr)
            const afgerondStatus = isAfgerond(module.nr)
            const isFirst = isEersteModule(module.nr)
            const isAndere = !isFirst && !afgerondStatus && unlocked

            return (
              <div
                key={module.nr}
                onClick={() => unlocked && navigate(`/module/${module.nr}`)}
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: unlocked ? 'pointer' : 'default',
                  opacity: 1,
                  background: 'white',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)' }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Foto */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={fotoMap[module.nr]}
                    alt={module.titel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: !unlocked ? 'grayscale(80%)' : 'none' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: afgerondStatus
  ? 'rgba(26,48,128,0.6)'
  : !unlocked
  ? 'rgba(0,0,0,0.5)'
  : 'rgba(26,48,128,0.25)',
                  }} />

                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    {afgerondStatus && (
                      <span style={{ background: groen, color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>✓ Voltooid</span>
                    )}
                    {isFirst && (
                      <span style={{ background: 'white', color: '#1A3080', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>Jouw module</span>
                    )}
                    {isAndere && (
                      <span style={{ background: 'rgba(255,255,255,0.9)', color: '#333', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>Ook interessant</span>
                    )}
                    {!unlocked && (
                      <span style={{ background: 'rgba(0,0,0,0.55)', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' }}>🔒 Vergrendeld</span>
                    )}
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(0,0,0,0.45)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600' }}>
                    Module {module.nr}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
                  <h2 style={{ margin: '0 0 0.25rem', color: '#1a1a1a', fontSize: '1rem', fontWeight: '700' }}>
                    {module.titel}
                  </h2>
                  <p style={{ margin: '0 0 0.6rem', color: '#333', fontSize: '0.82rem' }}>
                    {module.subtitel}
                  </p>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '0.72rem', fontWeight: '600',
                    padding: '2px 8px', borderRadius: '20px',
                    background: '#d4d4d4', color: '#333',
                    marginBottom: '0.75rem',
                  }}>
                    {module.doelgroep}
                  </div>
                  <div style={{ height: '3px', background: '#ddd', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: groen, width: afgerondStatus ? '100%' : '0%', borderRadius: '2px', transition: 'width 0.3s' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Community uitnodiging */}
        <div style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          borderLeft: `4px solid ${groen}`,
        }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#1a1a1a', fontSize: '1rem' }}>Word onderdeel van de InCultuur Community</h3>
          <p style={{ margin: '0 0 0.75rem', color: '#444', fontSize: '0.88rem', lineHeight: '1.65' }}>
            Binnen de community werken culturele organisaties, makers, professionals en ervaringsdeskundigen samen aan een toegankelijkere en inclusievere Haagse cultuursector.
          </p>
          <a href="mailto:contact@incultuur.nl" style={{ color: groen, fontWeight: '600', fontSize: '0.88rem', textDecoration: 'none' }}>
            contact@incultuur.nl →
          </a>
        </div>

      </main>
    </div>
  )
}

export default Dashboard