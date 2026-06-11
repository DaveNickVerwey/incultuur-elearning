import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { IconCultuur, IconBereik, IconSamenwerking, IconMogelijkheden } from './doelgroepIconen'

const groen = '#00A99D'
const groenDark = '#1A3080'

const moduleData = [
  { titel: 'Makers van cultuur', Icoon: IconCultuur },
  { titel: 'Makers van bereik', Icoon: IconBereik },
  { titel: 'Makers van samenwerking', Icoon: IconSamenwerking },
  { titel: 'Makers van mogelijkheden', Icoon: IconMogelijkheden },
]

function Sidebar({ actief, voortgang = {}, profiel: profielProp }) {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(profielProp || null)
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
    if (profielProp) { setProfiel(profielProp); return }
    if (!user) return
    const haalProfiel = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haalProfiel()
  }, [user, profielProp])

  const handleUitloggen = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const afgerond = Object.values(voortgang).filter(Boolean).length
  const percentage = Math.round((afgerond / 4) * 100)

  const eersteModule = profiel?.eersteModule || 1
  const allUnlocked = profiel?.allUnlocked || false

  const moduleStatus = (nr) => {
    if (voortgang[nr]) return 'afgerond'
    if (allUnlocked || nr === eersteModule) return 'beschikbaar'
    return 'vergrendeld'
  }

  const handleNavigeer = (pad) => {
    navigate(pad)
    setMobielOpen(false)
  }

  const navItem = (label, pad, actiefKey) => (
    <div
      onClick={() => handleNavigeer(pad)}
      style={{ padding: '8px 10px', borderRadius: '7px', marginBottom: '2px', background: actief === actiefKey ? '#E0F5F4' : 'transparent', cursor: 'pointer', fontSize: '14px', color: actief === actiefKey ? groenDark : '#333', fontWeight: actief === actiefKey ? '600' : '400', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: actief === actiefKey ? groen : '#aaa', display: 'inline-block', flexShrink: 0 }} />
      {label}
    </div>
  )

  const sidebarInhoud = (
    <div style={{ width: '220px', background: '#ffffff', color: '#1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: mobielOpen || !isMobiel ? 0 : '-220px', bottom: 0, overflowY: 'auto', transition: 'left 0.3s ease', zIndex: 100, borderRight: '1px solid rgba(0,0,0,0.09)' }}>

      {isMobiel && (
        <button onClick={() => setMobielOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#444', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
      )}

      {/* Logo */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
        <div style={{ fontWeight: '700', fontSize: '14px', color: groenDark }}>InCultuur Boost</div>
        {profiel && <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{profiel.naam} {profiel.achternaam}</div>}
      </div>

      <nav style={{ flex: 1, padding: '0.75rem' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: '#595959', padding: '8px 10px 4px', textTransform: 'uppercase' }}>Boost</div>

        {navItem('Dashboard', '/dashboard', 'dashboard')}

        {/* Modules met iconen */}
        <div
          onClick={() => setModulesOpen(!modulesOpen)}
          style={{ padding: '8px 10px', borderRadius: '7px', marginBottom: '2px', cursor: 'pointer', fontSize: '14px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#aaa', display: 'inline-block', flexShrink: 0 }} />
            Modules
          </div>
          <span style={{ fontSize: '11px', color: '#595959' }}>{modulesOpen ? '▲' : '▼'}</span>
        </div>

        {modulesOpen && (
          <div style={{ marginLeft: '1.1rem', marginBottom: '4px' }}>
            {moduleData.map((m, i) => {
              const nr = i + 1
              const status = moduleStatus(nr)
              const isActief = actief === `module-${nr}`
              return (
                <div
                  key={nr}
                  onClick={() => status !== 'vergrendeld' && handleNavigeer(`/module/${nr}`)}
                  style={{ padding: '6px 8px', fontSize: '12px', color: status === 'vergrendeld' ? '#767676' : isActief ? groenDark : '#444', display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px', cursor: status === 'vergrendeld' ? 'default' : 'pointer', borderRadius: '6px', background: isActief ? '#E0F5F4' : 'transparent', fontWeight: isActief ? '600' : '400' }}
                >
                  <m.Icoon size={16} stroke={1.6} color={status === 'vergrendeld' ? '#aaa' : isActief ? groenDark : groen} />
                  <span style={{ lineHeight: '1.3', flex: 1, minWidth: 0 }}>{m.titel}</span>
                  {status === 'afgerond' && <span style={{ fontSize: '10px', color: groen, flexShrink: 0 }}>✓</span>}
                  {status === 'vergrendeld' && <span style={{ fontSize: '10px', flexShrink: 0 }}>🔒</span>}
                </div>
              )
            })}
          </div>
        )}

        {navItem('Tips & Tools', '/tipstools', 'tipstools')}

        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: '#595959', padding: '10px 10px 4px', textTransform: 'uppercase' }}>Account</div>

        {navItem('Mijn profiel', '/mijnprofiel', 'profiel')}

        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: '#595959', padding: '10px 10px 4px', textTransform: 'uppercase' }}>Info</div>

        {navItem('Veelgestelde vragen', '/faq', 'faq')}
        {navItem('Privacy & gegevens', '/privacy', 'privacy')}
        {navItem('Contact', '/contact', 'contact')}
      </nav>

      {/* Voortgang */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.09)' }}>
        <div style={{ fontSize: '12px', color: '#444', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Voortgang</span>
          <span style={{ fontWeight: '700', color: groenDark }}>{percentage}%</span>
        </div>
        <div style={{ background: '#ddd', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
          <div style={{ background: groen, height: '5px', borderRadius: '4px', width: `${percentage}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {profiel && (
        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E0F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: groenDark, flexShrink: 0 }}>
            {(profiel.naam?.[0] || '') + (profiel.achternaam?.[0] || '')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profiel.naam} {profiel.achternaam}</div>
            <div style={{ fontSize: '11px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profiel.organisatie}</div>
          </div>
          <button onClick={handleUitloggen} style={{ fontSize: '12px', color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: '0', flexShrink: 0, fontWeight: '500' }}>
            Uit
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {isMobiel && !mobielOpen && (
        <button onClick={() => setMobielOpen(true)} style={{ position: 'fixed', top: '0.75rem', left: '0.75rem', zIndex: 101, background: groen, border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer', color: 'white', fontSize: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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