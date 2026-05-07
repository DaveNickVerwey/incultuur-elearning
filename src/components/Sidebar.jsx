import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'

const blauw = '#012c75'
const groen = '#039aa3'

const moduleTitels = [
  'Toegankelijkheid in één oogopslag',
  'Publieksbenadering zonder drempels',
  'Prikkelarm en voelbaar',
  'Samenwerken met ervaringsdeskundigen',
]

function Sidebar({ actief, voortgang = {} }) {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [modulesOpen, setModulesOpen] = useState(true)
  const [mobielOpen, setMobielOpen] = useState(false)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!user) return
    const haalProfiel = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haalProfiel()
  }, [user])

  const handleUitloggen = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const afgerond = Object.values(voortgang).filter(Boolean).length
  const percentage = Math.round((afgerond / 4) * 100)

  const moduleStatus = (nr) => {
    if (voortgang[nr]) return 'afgerond'
    if (nr === 1 || voortgang[nr - 1]) return 'beschikbaar'
    return 'vergrendeld'
  }

  const handleNavigeer = (pad) => {
    navigate(pad)
    setMobielOpen(false)
  }

  const sidebarInhoud = (
    <div style={{ width: '220px', background: blauw, color: 'white', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', position: 'fixed', top: 0, left: mobielOpen || !isMobiel ? 0 : '-220px', bottom: 0, overflowY: 'auto', transition: 'left 0.3s ease', zIndex: 100 }}>

      {isMobiel && (
        <button onClick={() => setMobielOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
      )}

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>InCultuur leren</div>
        {profiel && <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>{profiel.naam} {profiel.achternaam}</div>}
      </div>

      <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>MENU</div>
      <nav style={{ flex: 1 }}>

        <div onClick={() => handleNavigeer('/dashboard')} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '0.25rem', background: actief === 'dashboard' ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: actief === 'dashboard' ? groen : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          Dashboard
        </div>

        <div onClick={() => setModulesOpen(!modulesOpen)} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '0.25rem', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
            Modules
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{modulesOpen ? '▲' : '▼'}</span>
        </div>

        {modulesOpen && (
          <div style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
            {moduleTitels.map((titel, i) => {
              const nr = i + 1
              const status = moduleStatus(nr)
              return (
                <div key={nr} onClick={() => status !== 'vergrendeld' && handleNavigeer(`/module/${nr}`)} style={{ padding: '0.4rem 0.5rem', fontSize: '0.78rem', color: status === 'vergrendeld' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem', cursor: status === 'vergrendeld' ? 'default' : 'pointer' }}>
                  <span style={{ marginTop: '2px', flexShrink: 0 }}>{status === 'afgerond' ? '✓' : status === 'vergrendeld' ? '🔒' : '●'}</span>
                  <span>{titel}</span>
                </div>
              )
            })}
          </div>
        )}

        <div onClick={() => handleNavigeer('/mijnorganisatie')} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '0.25rem', background: actief === 'organisatie' ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: actief === 'organisatie' ? groen : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          Mijn organisatie
        </div>

        <div onClick={() => handleNavigeer('/mijnprofiel')} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '0.25rem', background: actief === 'profiel' ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: actief === 'profiel' ? groen : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          Mijn profiel
        </div>

        <div onClick={() => handleNavigeer('/contact')} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '0.25rem', background: actief === 'contact' ? 'rgba(255,255,255,0.15)' : 'transparent', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: actief === 'contact' ? groen : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          Contact
        </div>
      </nav>

      <div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.4rem' }}>Voortgang</div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '4px', height: '6px' }}>
          <div style={{ background: groen, height: '6px', borderRadius: '4px', width: `${percentage}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.4rem' }}>{percentage}%</div>
        <button onClick={handleUitloggen} style={{ marginTop: '1.5rem', width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
          Uitloggen
        </button>
      </div>
    </div>
  )

  return (
    <>
      {isMobiel && (
        <button onClick={() => setMobielOpen(true)} style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 99, background: blauw, border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer', color: 'white', fontSize: '1.25rem' }}>
          ☰
        </button>
      )}

      {isMobiel && mobielOpen && (
        <div onClick={() => setMobielOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }} />
      )}

      {sidebarInhoud}
    </>
  )
}

export default Sidebar