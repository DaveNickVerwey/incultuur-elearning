import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser } from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { alleBadges, checkBadges } from '../badges'
import { modulesData } from '../modulesData'

const blauw = '#012c75'
const groen = '#027a82'

function MijnProfiel() {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const [form, setForm] = useState({ naam: '', achternaam: '', organisatie: '', functie: '', verwachting: '' })
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [voortgang, setVoortgang] = useState({})
  const [badges, setBadges] = useState({})
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

  const handleVerwijderAccount = async () => {
    const bevestig = window.confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')
    if (!bevestig) return
    const ref = doc(db, 'gebruikers', user.uid)
    await deleteDoc(ref)
    await deleteUser(user)
  }

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

<main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.5rem 1.5rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '760px' }}>        <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Mijn profiel</h1>
        <p style={{ color: '#555', marginBottom: '2rem' }}>Pas je gegevens aan indien nodig</p>

        {Object.values(voortgang).filter(Boolean).length >= 4 && (
          <div onClick={() => navigate('/bewijs')} style={{ background: blauw, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>Bewijs van deelname</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Bekijk je certificaat en reflectie</p>
            </div>
            <span style={{ color: 'white', marginLeft: 'auto', fontSize: '1.25rem' }}>→</span>
          </div>
        )}

        {/* Badges */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ color: blauw, marginTop: 0, marginBottom: '0.4rem', fontSize: '1.15rem' }}>Jouw badges</h2>
          <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {behaaldAantal} van de {alleBadges.length} badges behaald
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '1rem' }}>
            {alleBadges.map((badge) => {
              const behaald = !!badges[badge.id]
              return (
                <div key={badge.id} style={{ padding: '1.25rem 0.75rem', borderRadius: '10px', background: behaald ? '#f8f9ff' : 'white', border: behaald ? `1px solid ${blauw}30` : '1px solid #eee', filter: behaald ? 'none' : 'grayscale(100%)', textAlign: 'center', minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icoon}</div>
                  <div style={{ fontWeight: '600', color: behaald ? blauw : '#333', fontSize: '0.82rem', marginBottom: '0.25rem' }}>{badge.naam}</div>
                  <div style={{ fontSize: '0.72rem', color: '#333', lineHeight: '1.4' }}>{badge.omschrijving}</div>
                  {behaald && <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: groen, fontWeight: '600' }}>✓ Behaald</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Profielformulier */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>
            <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem', fontSize: '1.15rem' }}>Persoonlijke gegevens</h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobiel ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="naam" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Voornaam</label>
                <input id="naam" name="naam" value={form.naam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label htmlFor="achternaam" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Achternaam</label>
                <input id="achternaam" name="achternaam" value={form.achternaam} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="organisatie" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Organisatie</label>
              <input id="organisatie" name="organisatie" value={form.organisatie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="functie" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Functie</label>
              <input id="functie" name="functie" value={form.functie} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label htmlFor="verwachting" style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '0.4rem' }}>Wat hoop je te leren?</label>
              <textarea id="verwachting" name="verwachting" value={form.verwachting} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <button type="submit" style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
              Opslaan
            </button>
            {opgeslagen && <p style={{ color: groen, fontWeight: '600', margin: 0 }}>✓ Opgeslagen!</p>}
          </div>
        </form>

        {/* Account verwijderen */}
        {badges.volleerd && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginTop: '1.5rem', border: '1px solid #fee2e2' }}>
            <h2 style={{ color: '#991b1b', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.15rem' }}>Account verwijderen</h2>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Je kunt je account en alle bijbehorende gegevens permanent verwijderen. Je bewijs van deelname kun je daarvoor nog downloaden via de knop hierboven.
            </p>
            <button onClick={handleVerwijderAccount} style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#991b1b', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
              Account verwijderen
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default MijnProfiel