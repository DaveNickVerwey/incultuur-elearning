import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { modulesData } from '../modulesData'
import { doelgroepSymbolen, rolNaarLetter } from './TipsEnTools'

const groen = '#00A99D'
const groenDark = '#1A3080'

function MijnProfiel() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', functie: '' })
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [voortgang, setVoortgang] = useState({})
  const [reflecties, setReflecties] = useState({})
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)

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
      if (snap.exists()) {
        const data = snap.data()
        setProfiel(data)
        setForm({ naam: data.naam || '', achternaam: data.achternaam || '', organisatie: data.organisatie || '', functie: data.functie || '' })
        setVoortgang(data.voortgang || {})
        const alleReflecties = {}
        modulesData.forEach((m) => {
          alleReflecties[m.nr] = { reflecties: data[`reflecties_${m.nr}`] || null, actie: data[`actie_${m.nr}`] || null }
        })
        setReflecties(alleReflecties)
      }
    }
    haalProfiel()
  }, [user])

  const handleVerwijderAccount = async () => {
    const bevestig = window.confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')
    if (!bevestig) return
    const ref = doc(db, 'gebruikers', user.uid)
    await deleteDoc(ref)
    await deleteUser(user)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { ...form }, { merge: true })
    setOpgeslagen(true)
    setTimeout(() => setOpgeslagen(false), 3000)
  }

  const afgerond = Object.values(voortgang).filter(Boolean).length
  const mijnLetter = profiel ? rolNaarLetter[profiel.rol] || 'C' : null
  const mijnDoelgroep = mijnLetter ? doelgroepSymbolen[mijnLetter] : null

  const profielKleuren = {
    Ontdekker:       { bg: '#E0F5F4', tekst: groenDark, icoon: '🌱' },
    Kijker:          { bg: '#E8EFFE', tekst: groenDark, icoon: '👀' },
    Drempelverlager: { bg: '#EFEDFC', tekst: groenDark, icoon: '🚪' },
    Voorloper:       { bg: '#FDF0DC', tekst: '#7A4A05', icoon: '⭐' },
  }
  const profielType = profiel?.profielType
  const pk = profielKleuren[profielType]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="profiel" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '760px' }}>

        {/* Titel met doelgroep icoon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          {mijnDoelgroep && <span style={{ fontSize: '2rem' }}>{mijnDoelgroep.icoon}</span>}
          <h1 style={{ color: '#1a1a1a', margin: 0, fontSize: isMobiel ? '1.4rem' : '1.75rem' }}>Mijn profiel</h1>
        </div>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>Bekijk je reflecties en pas je gegevens aan</p>

        {/* Bewijs banner */}
        {afgerond >= 4 && (
          <div onClick={() => navigate('/bewijs')} style={{ background: groenDark, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>Bewijs van deelname</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Bekijk je bewijs en reflecties</p>
            </div>
            <span style={{ color: 'white', marginLeft: 'auto', fontSize: '1.25rem' }}>→</span>
          </div>
        )}

        {/* In-Check profiel */}
        {profielType && pk && (
          <div style={{ background: pk.bg, border: `1px solid ${pk.tekst}20`, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{pk.icoon}</span>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', color: pk.tekst, textTransform: 'uppercase', marginBottom: '2px' }}>In-Check profiel</div>
              <div style={{ fontWeight: '600', color: pk.tekst }}>{profielType}</div>
            </div>
          </div>
        )}

        {/* De vier doelgroepen — 1 kleur */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.07em', color: '#595959', textTransform: 'uppercase', marginBottom: '0.75rem' }}>De vier doelgroepen</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(doelgroepSymbolen).map(([letter, d]) => (
              <div key={letter} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '20px',
                background: '#E0F5F4',
                border: mijnLetter === letter ? `2px solid ${groenDark}` : '1.5px solid transparent',
              }}>
                <span style={{ fontSize: '1rem' }}>{d.icoon}</span>
                <span style={{ fontSize: '12px', fontWeight: mijnLetter === letter ? '700' : '500', color: groenDark }}>
                  {letter} — {d.label}
                </span>
                {mijnLetter === letter && (
                  <span style={{ fontSize: '10px', background: groenDark, color: 'white', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>jij</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reflecties */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '0.4rem', fontSize: '1.1rem' }}>Mijn reflecties</h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Hier zie je alles wat je hebt ingevuld bij de modules.</p>

          {modulesData.map((module) => {
            const modReflecties = reflecties[module.nr]
            const isGedaan = !!voortgang[module.nr]
            return (
              <div key={module.nr} style={{ borderTop: '1px solid #eee', paddingTop: '1.25rem', marginTop: '1.25rem', opacity: isGedaan ? 1 : 0.45 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: isGedaan ? '1rem' : '0' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: isGedaan ? groen : '#aaa' }}>{isGedaan ? '✓' : '○'}</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#1a1a1a', fontWeight: '600' }}>Module {module.nr} — {module.titel}</h3>
                </div>
                {!isGedaan && <p style={{ margin: '0.4rem 0 0 1.2rem', fontSize: '0.82rem', color: '#aaa' }}>Nog niet afgerond</p>}
                {isGedaan && modReflecties && (
                  <div style={{ marginLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {module.reflectieVragen.map((vraag) => {
                      const antwoord = modReflecties.reflecties?.[vraag.id]
                      if (!antwoord) return null
                      return (
                        <div key={vraag.id} style={{ background: '#f0fafa', borderRadius: '8px', padding: '0.875rem 1rem', borderLeft: `3px solid ${groen}` }}>
                          <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: '600', color: groenDark }}>{vraag.vraag}</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#444', lineHeight: '1.65' }}>{antwoord}</p>
                        </div>
                      )
                    })}
                    {modReflecties.actie && (
                      <div style={{ background: '#EFEDFC', borderRadius: '8px', padding: '0.875rem 1rem', borderLeft: '3px solid #6B5ECC' }}>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: '600', color: '#3D3280' }}>Mijn actie-opdracht</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#444', lineHeight: '1.65' }}>{module.actieOpdracht.prefix} {modReflecties.actie}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Profielformulier */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1rem' }}>
            <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Persoonlijke gegevens</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam</label>
                <input name="naam" value={form.naam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam</label>
                <input name="achternaam" value={form.achternaam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie</label>
              <input name="organisatie" value={form.organisatie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Functie</label>
              <input name="functie" value={form.functie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '0.95rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button type="submit" style={{ padding: '0.85rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
              Opslaan
            </button>
            {opgeslagen && <p style={{ color: groen, fontWeight: '600', margin: 0 }}>✓ Opgeslagen!</p>}
          </div>
        </form>

        {/* Account verwijderen */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #fee2e2' }}>
          <h2 style={{ color: '#991b1b', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>Account verwijderen</h2>
          <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Je kunt je account en alle bijbehorende gegevens permanent verwijderen. Download eerst je bewijs van deelname als je dat wilt bewaren.
          </p>
          <button onClick={handleVerwijderAccount} style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#991b1b', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
            Account verwijderen
          </button>
        </div>

      </main>
    </div>
  )
}

export default MijnProfiel