import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { modulesData } from '../modulesData'
import module1Foto from '../assets/module1.jpg'
import module2Foto from '../assets/module2.jpg'
import module3Foto from '../assets/module3.jpg'
import module4Foto from '../assets/module4.jpg'

const blauw = '#012c75'
const groen = '#027a82'

const fotoMap = { 1: module1Foto, 2: module2Foto, 3: module3Foto, 4: module4Foto }

const scanFeedback = (gemiddelde) => {
  if (gemiddelde <= 3) return { tekst: 'Je staat aan het begin van je toegankelijkheidsreis. Er is veel ruimte voor groei — en dat is juist een kans!', kleur: '#ef4444' }
  if (gemiddelde <= 5) return { tekst: 'Je bent op weg! Er zijn al mooie stappen gezet, maar er valt nog veel te winnen.', kleur: '#f97316' }
  if (gemiddelde <= 7) return { tekst: 'Goed bezig! Je organisatie heeft al een stevige basis. Blijf bouwen aan de onderdelen die nog aandacht vragen.', kleur: '#eab308' }
  if (gemiddelde <= 9) return { tekst: 'Indrukwekkend! Je organisatie is al aardig toegankelijk. Kleine verbeteringen maken het verschil.', kleur: groen }
  return { tekst: 'Wauw — een echte toegankelijke organisatie! Deel je aanpak met anderen in de sector.', kleur: blauw }
}

function Module() {
  const { nr } = useParams()
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [stap, setStap] = useState('intro')
  const [quizAntwoorden, setQuizAntwoorden] = useState({})
  const [schuivers, setSchuivers] = useState({})
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  const module = modulesData.find((m) => m.nr === parseInt(nr))

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setVoortgang(snap.data().voortgang || {})
    }
    haal()
  }, [user])

  useEffect(() => {
    if (module?.schuivers) {
      const startWaarden = {}
      module.schuivers.forEach((_, i) => { startWaarden[i] = 5 })
      setSchuivers(startWaarden)
    }
  }, [module])

  if (!module) return <div style={{ padding: '2rem' }}>Module niet gevonden</div>

  const stappen = [
    'intro',
    ...(module.inhoud ? ['inhoud'] : []),
    ...(module.video ? ['video'] : []),
    'quiz',
    'actiepunt',
  ]

  const stapNamen = { intro: 'Intro', inhoud: 'Inhoud', video: 'Video', quiz: 'Quiz', actiepunt: 'Actiepunt' }

  const alleGoed = module.quiz.every((_, i) => quizAntwoorden[i]?.correct)

  const handleAntwoord = (quizNr, optieNr) => {
    if (quizAntwoorden[quizNr]?.correct) return
    const isCorrect = optieNr === module.quiz[quizNr].correct
    setQuizAntwoorden({
      ...quizAntwoorden,
      [quizNr]: { gekozen: optieNr, correct: isCorrect, geprobeerd: [...(quizAntwoorden[quizNr]?.geprobeerd || []), optieNr] }
    })
  }

  const gemiddeldeScore = module.schuivers
    ? Object.values(schuivers).reduce((a, b) => a + b, 0) / module.schuivers.length
    : 0

  const handleAfgerond = async () => {
    const nieuwVoortgang = { ...voortgang, [module.nr]: true }
    setVoortgang(nieuwVoortgang)
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { voortgang: nieuwVoortgang }, { merge: true })
    if (module.nr === 4) {
      navigate('/bewijs')
    } else {
      navigate('/dashboard')
    }
  }

  const vorigeStap = () => {
    const index = stappen.indexOf(stap)
    if (index > 0) setStap(stappen[index - 1])
  }

  const volgendeStap = () => {
    const index = stappen.indexOf(stap)
    if (index < stappen.length - 1) setStap(stappen[index + 1])
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: 'white' }}>
      <Sidebar actief="modules" voortgang={voortgang} />

<main style={{ marginLeft: isMobiel ? 0 : '220px', flex: 1, overflowX: 'hidden' }}>
        {/* Hero */}
        <div style={{ background: blauw, padding: isMobiel ? '4rem 1.5rem 2rem 1.5rem' : '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${fotoMap[module.nr]})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {!isMobiel && <p style={{ color: groen, fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MODULE {module.nr} · {module.duur}</p>}
            <h1 style={{ color: 'white', fontSize: isMobiel ? '1.4rem' : '2rem', margin: '0 0 0.75rem' }}>{module.titel}</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{module.subtitel}</p>
{isMobiel && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', marginTop: '0.5rem' }}>⏱ {module.duur}</p>}          </div>
        </div>

        {/* Stappen navigatie */}
        <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 1.5rem', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
          {stappen.map((s, i) => (
            <button key={s} onClick={() => setStap(s)} style={{ padding: '1rem 0', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: stap === s ? '600' : '400', color: stap === s ? blauw : '#555', borderBottom: stap === s ? `2px solid ${blauw}` : '2px solid transparent', whiteSpace: 'nowrap' }}>
              {i + 1}. {stapNamen[s]}
            </button>
          ))}
        </div>

     {/* Inhoud */}
        <div style={{ padding: isMobiel ? '1.25rem 1rem' : '2.5rem', overflowX: 'hidden' }}>

          {stap === 'intro' && (
            <div style={{ maxWidth: '720px' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444', marginBottom: '2rem' }}>{module.intro}</p>
              <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
                <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1.25rem', fontSize: '1.1rem' }}>Na deze module kun je...</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {module.leerdoelen.map((doel, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: groen, fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#444' }}>{doel}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={volgendeStap} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
                Volgende →
              </button>
            </div>
          )}

          {stap === 'inhoud' && module.inhoud && (
            <div style={{ maxWidth: '860px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: isMobiel ? '1.5rem' : '2.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
                {module.inhoud.map((blok, i) => {
                  if (blok.type === 'tekst') return (
                    <div key={i} style={{ marginBottom: i < module.inhoud.length - 1 ? '2rem' : 0 }}>
                      <h2 style={{ color: blauw, marginTop: 0, marginBottom: '0.6rem', fontSize: '1.1rem' }}>{blok.titel}</h2>
                      <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#444', margin: 0 }}>{blok.tekst}</p>
                    </div>
                  )
                  if (blok.type === 'quote') return (
                    <div key={i} style={{ borderLeft: `4px solid ${groen}`, background: '#f0fdf9', borderRadius: '0 8px 8px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
                      <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#1a4a3a', fontStyle: 'italic', margin: '0 0 0.6rem' }}>"{blok.tekst}"</p>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#555' }}>— {blok.auteur}</p>
                    </div>
                  )
                  if (blok.type === 'foto') return (
                    <div key={i} style={{ margin: '1rem 0', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={blok.url} alt={blok.alt} style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )
                  return null
                })}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.85rem 2rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button onClick={volgendeStap} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>Naar de quiz →</button>
              </div>
            </div>
          )}

          {stap === 'video' && module.video && (
            <div style={{ maxWidth: '720px' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444', marginBottom: '1.5rem' }}>{module.videotekst}</p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
                <iframe width="100%" height={isMobiel ? '220' : '380'} src={module.video} title="Module video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.85rem 2rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                <button onClick={volgendeStap} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>Naar de quiz →</button>
              </div>
            </div>
          )}

          {stap === 'quiz' && (
            <div style={{ maxWidth: '720px' }}>
              <h2 style={{ color: blauw, marginTop: 0 }}>Quiz</h2>
              <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Beantwoord alle vragen correct om verder te gaan.</p>
              {module.quiz.map((vraag, i) => {
                const antwoord = quizAntwoorden[i]
                const isGoed = antwoord?.correct
                const gekozenOptie = antwoord?.gekozen

                return (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1rem', border: isGoed ? `2px solid ${groen}` : antwoord && !isGoed ? '2px solid #ef4444' : '2px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {isGoed && <span style={{ color: groen }}>✓</span>}
                      {antwoord && !isGoed && <span style={{ color: '#ef4444' }}>✗</span>}
                      <p style={{ fontWeight: '600', color: '#222', margin: 0 }}>{i + 1}. {vraag.vraag}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {vraag.opties.map((optie, j) => {
                        const geprobeerd = antwoord?.geprobeerd?.includes(j)
                        const isJuist = j === vraag.correct
                        let bg = '#f8f9fa'
                        let border = '1px solid #eee'
                        let kleur = '#333'
                        if (isGoed && isJuist) { bg = '#f0fdf4'; border = `1px solid ${groen}`; kleur = '#166534' }
                        else if (geprobeerd && !isJuist) { bg = '#fff5f5'; border = '1px solid #fca5a5'; kleur = '#991b1b' }
                        return (
                          <div key={j} onClick={() => !isGoed && handleAntwoord(i, j)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: bg, border, cursor: isGoed ? 'default' : 'pointer', fontSize: '0.95rem', color: kleur, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isGoed && isJuist && <span>✓</span>}
                            {geprobeerd && !isJuist && <span>✗</span>}
                            {optie}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ minHeight: '80px', padding: '0.75rem 1rem', borderRadius: '8px', background: antwoord ? (isGoed ? '#f0fdf4' : '#fff5f5') : '#f8f9fa', border: antwoord ? (isGoed ? `1px solid ${groen}` : '1px solid #fca5a5') : '1px solid #eee' }}>
                      {antwoord ? (
                        <>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.88rem', fontWeight: '600', color: isGoed ? '#166534' : '#991b1b' }}>
                            {isGoed ? '✓ Goed!' : '✗ Niet helemaal.'}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: '#444', lineHeight: '1.5' }}>
                            {vraag.toelichtingen ? vraag.toelichtingen[gekozenOptie] : vraag.toelichting}
                          </p>
                          {!isGoed && <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#555' }}>Probeer het opnieuw.</p>}
                        </>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#999' }}>Kies een antwoord om toelichting te zien.</p>
                      )}
                    </div>
                  </div>
                )
              })}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button onClick={vorigeStap} style={{ padding: '0.85rem 2rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>← Terug</button>
                {alleGoed ? (
                  <button onClick={volgendeStap} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', flex: isMobiel ? 1 : 'none' }}>
                    Naar het actiepunt →
                  </button>
                ) : (
                  <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Beantwoord alle vragen correct om verder te gaan.</p>
                )}
              </div>
            </div>
          )}

          {stap === 'actiepunt' && (
            <div style={{ maxWidth: '720px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
                <h2 style={{ color: blauw, marginTop: 0 }}>Jouw actiepunt</h2>
                <p style={{ color: '#444', lineHeight: '1.7' }}>{module.actiepuntTekst || module.actiepunt}</p>
                {module.actiepuntTip && (
                  <div style={{ background: '#f8f9ff', border: `1px solid ${blauw}20`, borderRadius: '8px', padding: '1.25rem', marginTop: '1rem' }}>
                    <p style={{ color: blauw, fontWeight: '600', margin: '0 0 0.5rem' }}>Tip</p>
                    <p style={{ color: '#555', margin: 0, fontSize: '0.9rem' }}>{module.actiepuntTip}</p>
                  </div>
                )}
              </div>

              {module.schuivers && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
                  <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Hoe toegankelijk is jouw organisatie?</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {module.schuivers.map((schuiver, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                          <div style={{ flex: 1, marginRight: '1rem' }}>
                            <span style={{ fontWeight: '600', color: '#222', fontSize: '0.95rem' }}>{schuiver.titel}</span>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#555' }}>{schuiver.subtitel}</p>
                          </div>
                          <span style={{ fontWeight: 'bold', color: blauw, fontSize: '1.1rem', flexShrink: 0 }}>{schuivers[i] || 5}/10</span>
                        </div>
                        <input type="range" min="1" max="10" value={schuivers[i] || 5} onChange={(e) => setSchuivers({ ...schuivers, [i]: parseInt(e.target.value) })} style={{ width: '100%', accentColor: blauw }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#555', marginTop: '0.2rem' }}>
                          <span>Nog niet aanwezig</span>
                          <span>Volledig aanwezig</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '10px', background: '#f8f9ff', border: `1px solid ${blauw}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📊</span>
                      <span style={{ fontWeight: '700', color: blauw, fontSize: '1.1rem' }}>Gemiddelde score: {gemiddeldeScore.toFixed(1)}/10</span>
                    </div>
                    <p style={{ margin: 0, color: scanFeedback(gemiddeldeScore).kleur, fontWeight: '600', fontSize: '0.95rem' }}>
                      {scanFeedback(gemiddeldeScore).tekst}
                    </p>
                  </div>
                </div>
              )}

              <button onClick={handleAfgerond} style={{ padding: '0.85rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: isMobiel ? '100%' : 'auto' }}>
                Module afronden ✓
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Module