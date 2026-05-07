import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Sidebar from '../components/Sidebar'
import { alleBadges, checkBadges } from '../badges'
import { modulesData } from '../modulesData'

const blauw = '#012c75'
const groen = '#039aa3'

function MijnProfiel() {
  const [user] = useAuthState(auth)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', functie: '', verwachting: '' })
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [voortgang, setVoortgang] = useState({})
  const [badges, setBadges] = useState({})

  useEffect(() => {
    if (!user) return
    const haalProfiel = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setForm({
          naam: data.naam || '',
          achternaam: data.achternaam || '',
          organisatie: data.organisatie || '',
          functie: data.functie || '',
          verwachting: data.verwachting || ''
        })
        setVoortgang(data.voortgang || {})

        const totaalInzichten = modulesData
          .filter((m) => (data.voortgang || {})[m.nr])
          .reduce((acc, m) => acc + m.leerdoelen.length, 0)

        const nieuweBadges = checkBadges({ ...data, inzichten: totaalInzichten })
        setBadges(nieuweBadges)

        if (JSON.stringify(nieuweBadges) !== JSON.stringify(data.badges || {})) {
          await setDoc(ref, { badges: nieuweBadges }, { merge: true })
        }
      }
    }
    haalProfiel()
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { ...form }, { merge: true })
    setOpgeslagen(true)
    setTimeout(() => setOpgeslagen(false), 3000)
  }

  const behaaldAantal = Object.values(badges).filter(Boolean).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="profiel" voortgang={voortgang} />

      <div style={{ marginLeft: '220px', padding: '2.5rem', flex: 1, maxWidth: '760px' }}>
        <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Mijn profiel</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Pas je gegevens aan indien nodig</p>

        {/* Badges */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h3 style={{ color: blauw, marginTop: 0, marginBottom: '0.4rem' }}>Jouw badges</h3>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {behaaldAantal} van de {alleBadges.length} badges behaald
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {alleBadges.map((badge) => {
              const behaald = !!badges[badge.id]
              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '1.5rem 1rem',
                    borderRadius: '10px',
                    background: behaald ? '#f8f9ff' : '#fafafa',
                    border: behaald ? `1px solid ${blauw}30` : '1px solid #eee',
                    opacity: behaald ? 1 : 0.4,
                    textAlign: 'center',
                    minHeight: '190px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '2.75rem', marginBottom: '0.6rem' }}>{badge.icoon}</div>
                  <div style={{ fontWeight: '600', color: behaald ? blauw : '#888', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{badge.naam}</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: '1.4', minHeight: '2.5rem' }}>{badge.omschrijving}</div>
                  {behaald && (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: groen, fontWeight: '600' }}>✓ Behaald</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Profielformulier */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h3 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem' }}>Persoonlijke gegevens</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam</label>
                <input name="naam" value={form.naam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam</label>
                <input name="achternaam" value={form.achternaam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie</label>
              <input name="organisatie" value={form.organisatie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Functie</label>
              <input name="functie" value={form.functie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wat hoop je te leren?</label>
              <textarea name="verwachting" value={form.verwachting} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
              Opslaan
            </button>
            {opgeslagen && <p style={{ color: groen, fontWeight: '600', margin: 0 }}>✓ Opgeslagen!</p>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MijnProfiel