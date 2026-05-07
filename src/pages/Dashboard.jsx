import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import module1Foto from '../assets/module1.jpg'
import module2Foto from '../assets/module2.jpg'
import module3Foto from '../assets/module3.jpg'
import module4Foto from '../assets/module4.jpg'

const blauw = '#012c75'
const groen = '#039aa3'

const modules = [
  { nr: 1, titel: 'Toegankelijkheid in één oogopslag', subtitel: 'Basiskennis', duur: '15 min', foto: module1Foto },
  { nr: 2, titel: 'Publieksbenadering zonder drempels', subtitel: 'Communicatie', duur: '15 min', foto: module2Foto },
  { nr: 3, titel: 'Prikkelarm en voelbaar', subtitel: 'Sensorisch', duur: '15 min', foto: module3Foto },
  { nr: 4, titel: 'Samenwerken met ervaringsdeskundigen', subtitel: 'Co-creatie', duur: '15 min', foto: module4Foto },
]

const inzichtStatus = (aantal) => {
  if (aantal === 0) return 'Klaar om te beginnen! Je eerste module wacht op je.'
  if (aantal <= 4) return 'Je bent begonnen! Blijf je verdiepen en ga zo door.'
  if (aantal <= 8) return 'Je bent goed op weg, blijf zo doorgaan!'
  if (aantal <= 12) return 'Indrukwekkend! Je kennis groeit snel.'
  return 'Wauw, je bent een echte toegankelijkheidsexpert!'
}

function Dashboard() {
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [profiel, setProfiel] = useState(null)
  const navigate = useNavigate()

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

  const afgerond = Object.values(voortgang).filter(Boolean).length
  const percentage = Math.round((afgerond / modules.length) * 100)

  const totaalInzichten = modulesData
    .filter((m) => voortgang[m.nr])
    .reduce((acc, m) => acc + m.leerdoelen.length, 0)

  const maxInzichten = modulesData.reduce((acc, m) => acc + m.leerdoelen.length, 0)

  const isVergrendeld = (nr) => nr > 1 && !voortgang[nr - 1]
  const isAfgerond = (nr) => !!voortgang[nr]
  const isVolgende = (nr) => !isAfgerond(nr) && !isVergrendeld(nr)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="dashboard" voortgang={voortgang} />

      <div style={{ marginLeft: '220px', padding: '2.5rem', flex: 1 }}>

        {profiel && (
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: blauw, margin: 0 }}>Hallo, {profiel.naam}!</h1>
            <p style={{ color: '#888', marginTop: '0.4rem' }}>Ga verder waar je gebleven bent</p>
          </div>
        )}

        {/* 2 statistiekblokjes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Voortgang */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.25rem' }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: blauw }}>{percentage}%</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>voortgang</div>
              </div>
              <div style={{ marginTop: '0.4rem', height: '4px', background: '#eee', borderRadius: '4px' }}>
                <div style={{ height: '4px', borderRadius: '4px', background: groen, width: `${percentage}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>

          {/* Opgedane inzichten */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.25rem' }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: blauw }}>{totaalInzichten}<span style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: '400' }}>/{maxInzichten}</span></div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>inzichten</div>
              </div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: groen, fontStyle: 'italic', lineHeight: '1.4' }}>
                {inzichtStatus(totaalInzichten)}
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Module grid */}
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#888', marginBottom: '1rem' }}>MODULES</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {modules.map((module) => {
            const vergrendeld = isVergrendeld(module.nr)
            const afgerondStatus = isAfgerond(module.nr)
            const volgende = isVolgende(module.nr)

            return (
              <div
                key={module.nr}
                onClick={() => !vergrendeld && navigate(`/module/${module.nr}`)}
                style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: vergrendeld ? 'default' : 'pointer', opacity: vergrendeld ? 0.6 : 1, position: 'relative', background: 'white' }}
              >
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={module.foto}
                    alt={module.titel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: vergrendeld ? 'grayscale(100%)' : 'none' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: vergrendeld ? 'rgba(0,0,0,0.4)' : afgerondStatus ? `${groen}99` : `${blauw}55` }} />

                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    {afgerondStatus && (
                      <span style={{ background: groen, color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>✓ Voltooid</span>
                    )}
                    {volgende && (
                      <span style={{ background: blauw, color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>Beschikbaar</span>
                    )}
                    {vergrendeld && (
                      <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem' }}>🔒 Vergrendeld</span>
                    )}
                  </div>

                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                    Module {module.nr}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ margin: '0 0 0.4rem', color: vergrendeld ? '#aaa' : blauw, fontSize: '1rem' }}>{module.titel}</h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{module.subtitel} · {module.duur}</p>
                  <div style={{ marginTop: '0.75rem', height: '4px', background: '#eee', borderRadius: '4px' }}>
                    <div style={{ height: '4px', borderRadius: '4px', background: afgerondStatus ? groen : 'transparent', width: afgerondStatus ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard