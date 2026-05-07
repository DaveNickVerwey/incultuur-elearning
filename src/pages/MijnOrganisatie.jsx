import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Sidebar from '../components/Sidebar'

const blauw = '#012c75'
const groen = '#039aa3'

const stappen = [
  {
    id: 'basis',
    titel: 'Basisinformatie',
    intro: 'Vertel ons iets over jouw organisatie. Deze informatie helpt ons om de uitkomsten van de audit beter te interpreteren.',
    vragen: [
      { id: 'type', type: 'select', label: 'Type organisatie', tip: 'Kies de categorie die het beste bij jouw organisatie past.', opties: ['Museum', 'Theater', 'Filmhuis', 'Concertzaal', 'Bibliotheek', 'Galerie', 'Festival', 'Anders'] },
      { id: 'grootte', type: 'select', label: 'Grootte organisatie', tip: 'Hoeveel medewerkers (inclusief vrijwilligers) heeft jouw organisatie?', opties: ['1-10 medewerkers', '11-50 medewerkers', '51-200 medewerkers', 'Meer dan 200 medewerkers'] },
      { id: 'bezoekers', type: 'select', label: 'Aantal bezoekers per jaar', tip: 'Een schatting is prima.', opties: ['Minder dan 5.000', '5.000 - 25.000', '25.000 - 100.000', 'Meer dan 100.000'] },
    ],
  },
  {
    id: 'fysiek',
    titel: 'Fysieke toegankelijkheid',
    intro: 'Loop zelf door je gebouw en beantwoord de vragen. Neem hier écht de tijd voor — pak een notitieblokje en doe een ronde door je locatie. Kijk met de ogen van een bezoeker die moeite heeft met lopen, zien of horen.',
    vragen: [
      { id: 'ingang', type: 'check', label: 'De hoofdingang is minimaal 85cm breed en drempelvrij', tip: 'Meet de breedte van de deur en controleer of er een drempel is. 85cm is de minimale breedte voor een rolstoel.' },
      { id: 'invalidentoilet', type: 'check', label: 'Er is een toegankelijk toilet aanwezig', tip: 'Controleer of het toilet groot genoeg is voor een rolstoel (minimaal 150x150cm vrije ruimte) en of er een beugel aanwezig is.' },
      { id: 'lift', type: 'check', label: 'Alle verdiepingen zijn bereikbaar zonder trap', tip: 'Is er een lift, hellingbaan of alternatieve route? Test of een bezoeker in een rolstoel zelfstandig alle ruimtes kan bereiken.' },
      { id: 'bewegwijzering', type: 'check', label: 'De bewegwijzering is duidelijk en goed zichtbaar', tip: 'Loop de route van ingang naar de belangrijkste ruimtes. Zijn de bordjes groot genoeg? Staan ze op de juiste hoogte? Zijn ze ook zichtbaar voor iemand met een visuele beperking?' },
      { id: 'rustigehoek', type: 'check', label: 'Er is een rustige plek waar bezoekers even kunnen uitrusten', tip: 'Dit hoeft niet groot te zijn — een stoel in een stille hoek is al waardevol. Kijk of er ergens een plek is weg van drukte en geluid.' },
      { id: 'geleidelijnen', type: 'check', label: 'Er zijn geleidelijnen of visuele markeringen voor mensen met een visuele beperking', tip: 'Geleidelijnen zijn ribbels in de vloer die blinden en slechtzienden de weg wijzen. Kijk of deze aanwezig zijn bij ingangen en trappen.' },
      { id: 'fysiek_score', type: 'slider', label: 'Hoe toegankelijk is de fysieke ruimte overall?', tip: 'Geef een eerlijk cijfer op basis van wat je zojuist hebt ontdekt. Vertrouw op je eigen indruk.' },
    ],
  },
  {
    id: 'bezoekers',
    titel: 'Bezoekersonderzoek',
    intro: 'Ga het gesprek aan met je bezoekers! Spreek minimaal 3 bezoekers aan — het liefst mensen met verschillende achtergronden. Vraag ze kort naar hun ervaring. Dit is misschien het meest waardevolle onderdeel van deze audit: je hoort het rechtstreeks van de mensen om wie het gaat.',
    vragen: [
      { id: 'welkom_score', type: 'slider', label: 'Hoe welkom voelden bezoekers zich gemiddeld? (1-10)', tip: 'Vraag minimaal 3 bezoekers: "Op een schaal van 1 tot 10, hoe welkom voelde u zich bij binnenkomst?" Noteer de scores en vul het gemiddelde in.' },
      { id: 'zelfstandig', type: 'check', label: 'Bezoekers konden alles zelfstandig vinden zonder hulp te vragen', tip: 'Vraag bezoekers: "Heeft u ergens hulp bij nodig gehad om iets te vinden?" Als meer dan 1 op de 3 bezoekers dit bevestigt, vink dan niet aan.' },
      { id: 'miste_iets', type: 'tekst', label: 'Wat misten bezoekers op het gebied van toegankelijkheid?', tip: 'Vraag bezoekers open: "Is er iets dat u miste of dat beter zou kunnen?" Noteer de meest genoemde punten hier.' },
      { id: 'bezoeker_score', type: 'slider', label: 'Hoe tevreden waren bezoekers over de toegankelijkheid overall?', tip: 'Vraag bezoekers: "Hoe toegankelijk vindt u onze locatie overall, op een schaal van 1 tot 10?" Vul het gemiddelde in.' },
    ],
  },
  {
    id: 'digitaal',
    titel: 'Digitale & communicatie check',
    intro: 'Open je website en social media kanalen en doorloop de vragen. Je hoeft geen technisch expert te zijn — de meeste dingen kun je gewoon met je ogen beoordelen.',
    vragen: [
      { id: 'website_toegankelijk', type: 'check', label: 'De website vermeldt duidelijk wat de toegankelijkheidsmogelijkheden zijn', tip: 'Zoek op je website naar informatie over toegankelijkheid. Staat er iets over invalidentoilet, parkeren, of toegankelijke ingang? Als je het niet kunt vinden, kunnen bezoekers dat ook niet.' },
      { id: 'alt_teksten', type: 'check', label: 'Afbeeldingen op de website hebben beschrijvende alt-teksten', tip: 'Klik met de rechtermuisknop op een afbeelding op je website en kies "Inspecteren". Zoek naar alt="..." — staat er een beschrijving? Doe dit bij 3 afbeeldingen.' },
      { id: 'ondertitels', type: 'check', label: 'Video\'s op de website of social media hebben ondertitels', tip: 'Bekijk een video op je website of Instagram. Zijn er ondertitels? YouTube genereert automatisch ondertitels — zijn die ingeschakeld?' },
      { id: 'begrijpelijke_taal', type: 'check', label: 'De communicatie is geschreven in begrijpelijke taal (B1-niveau)', tip: 'Lees een nieuwsbericht of aankondiging op je website. Zijn de zinnen kort? Wordt jargon vermeden? Vraag iemand zonder cultuurachtergrond het te lezen.' },
      { id: 'social_inclusief', type: 'check', label: 'Social media berichten zijn inclusief (bijschriften bij foto\'s, geen exclusief taalgebruik)', tip: 'Bekijk je laatste 5 Instagram- of Facebook-posts. Staan er beschrijvingen bij de foto\'s? Is het taalgebruik inclusief en uitnodigend voor iedereen?' },
      { id: 'digitaal_score', type: 'slider', label: 'Hoe digitaal toegankelijk is jouw organisatie overall?', tip: 'Geef een eerlijk cijfer op basis van wat je zojuist hebt ontdekt.' },
    ],
  },
]

const berekenCijfer = (antwoorden) => {
  let punten = 0
  let max = 0

  stappen.forEach((stap) => {
    stap.vragen.forEach((vraag) => {
      if (vraag.type === 'check') {
        max += 10
        if (antwoorden[vraag.id]) punten += 10
      }
      if (vraag.type === 'slider') {
        max += 10
        punten += (antwoorden[vraag.id] || 5)
      }
    })
  })

  return Math.round((punten / max) * 10 * 10) / 10
}

const genereerTodos = (antwoorden) => {
  const todos = []

  if (!antwoorden.ingang) todos.push('Controleer en verbeter de toegankelijkheid van de hoofdingang — meet de breedte en verwijder drempels waar mogelijk.')
  if (!antwoorden.invalidentoilet) todos.push('Zorg voor een toegankelijk toilet — neem contact op met een toegankelijkheidsadviseur voor de vereisten.')
  if (!antwoorden.lift) todos.push('Maak alle verdiepingen bereikbaar zonder trap — onderzoek de mogelijkheid van een lift of hellingbaan.')
  if (!antwoorden.bewegwijzering) todos.push('Verbeter de bewegwijzering — grotere bordjes, hogere plaatsing en duidelijkere kleuren.')
  if (!antwoorden.rustigehoek) todos.push('Creëer een rustige hoek — een stoel in een stille ruimte is al een grote stap.')
  if (!antwoorden.website_toegankelijk) todos.push('Voeg een toegankelijkheidspagina toe aan je website met informatie over faciliteiten.')
  if (!antwoorden.ondertitels) todos.push('Voeg ondertitels toe aan video\'s — YouTube en Instagram bieden automatische ondertiteling.')
  if (!antwoorden.begrijpelijke_taal) todos.push('Herschrijf je communicatie op B1-niveau — gebruik kortere zinnen en minder jargon.')
  if ((antwoorden.welkom_score || 5) < 7) todos.push('Werk aan de welkomstbeleving — train medewerkers in inclusieve ontvangst en zorg voor een uitnodigende entree.')
  if (!antwoorden.alt_teksten) todos.push('Voeg alt-teksten toe aan afbeeldingen op je website — dit helpt mensen met een visuele beperking.')

  return todos.slice(0, 3)
}

function MijnOrganisatie() {
  const [user] = useAuthState(auth)
  const [voortgang, setVoortgang] = useState({})
  const [stapIndex, setStapIndex] = useState(0)
  const [antwoorden, setAntwoorden] = useState({})
  const [klaar, setKlaar] = useState(false)
  const [opgeslagen, setOpgeslagen] = useState(false)

  useEffect(() => {
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setVoortgang(snap.data().voortgang || {})
        if (snap.data().organisatieAudit) {
          setAntwoorden(snap.data().organisatieAudit)
          setKlaar(true)
        }
      }
    }
    haal()
  }, [user])

  const huidigeStap = stappen[stapIndex]

  const handleAntwoord = (id, waarde) => {
    setAntwoorden({ ...antwoorden, [id]: waarde })
  }

  const handleOpslaan = async () => {
    const ref = doc(db, 'gebruikers', user.uid)
    await setDoc(ref, { organisatieAudit: antwoorden }, { merge: true })
    setOpgeslagen(true)
    setKlaar(true)
    setTimeout(() => setOpgeslagen(false), 3000)
  }

  const cijfer = berekenCijfer(antwoorden)
  const todos = genereerTodos(antwoorden)

  const cijferKleur = cijfer >= 8 ? groen : cijfer >= 6 ? '#eab308' : cijfer >= 4 ? '#f97316' : '#ef4444'
  const cijferLabel = cijfer >= 8 ? 'Uitstekend' : cijfer >= 6 ? 'Goed op weg' : cijfer >= 4 ? 'Nog veel te winnen' : 'Begin bij de basis'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f5f5' }}>
      <Sidebar actief="organisatie" voortgang={voortgang} />

      <div style={{ marginLeft: '220px', padding: '2.5rem', flex: 1, maxWidth: '760px' }}>
        <h1 style={{ color: blauw, marginBottom: '0.5rem' }}>Mijn organisatie</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Een actieve meting van jouw organisatie op het gebied van toegankelijkheid</p>

        {/* Introductieblok */}
        {!klaar && stapIndex === 0 && (
          <div style={{ background: `linear-gradient(135deg, ${blauw}, #024a8f)`, borderRadius: '12px', padding: '2rem', marginBottom: '2rem', color: 'white' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.3rem' }}>Hoe toegankelijk is jouw organisatie écht?</h2>
            <p style={{ lineHeight: '1.7', opacity: 0.9, marginBottom: '1rem' }}>
              Dit is geen gewoon formulier. Dit is een actieve audit waarbij je zelf op onderzoek uitgaat — door je gebouw loopt, met bezoekers praat en je digitale kanalen onder de loep neemt. Verwacht je maar aan een uur werk, verspreid over meerdere momenten.
            </p>
            <p style={{ lineHeight: '1.7', opacity: 0.9, marginBottom: 0 }}>
              Aan het einde krijg je een rapportcijfer en drie concrete to-do's waarmee je direct aan de slag kunt. Vul de vragen zo eerlijk mogelijk in — de uitkomst is voor jezelf en helpt je om te bepalen waar je de meeste winst kunt behalen.
            </p>
          </div>
        )}

        {/* Resultaat als klaar */}
        {klaar && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
            <h2 style={{ color: blauw, marginTop: 0, marginBottom: '1.5rem' }}>Jouw toegankelijkheidsscore</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: cijferKleur, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{cijfer}</span>
                <span style={{ color: 'white', fontSize: '0.7rem', opacity: 0.8 }}>/ 10</span>
              </div>
              <div>
                <p style={{ fontWeight: '700', color: cijferKleur, fontSize: '1.2rem', margin: '0 0 0.4rem' }}>{cijferLabel}</p>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>
                  Op basis van jouw antwoorden over de fysieke omgeving, bezoekersonderzoek en digitale toegankelijkheid.
                </p>
              </div>
            </div>

            <h3 style={{ color: blauw, marginTop: 0, marginBottom: '1rem' }}>Jouw 3 prioriteiten</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {todos.map((todo, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: '#f8f9ff', borderRadius: '8px', border: `1px solid ${blauw}15` }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: blauw, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, color: '#444', fontSize: '0.9rem', lineHeight: '1.6' }}>{todo}</p>
                </div>
              ))}
            </div>

            <button onClick={() => { setKlaar(false); setStapIndex(0) }} style={{ padding: '0.75rem 1.5rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
              Audit opnieuw invullen
            </button>
          </div>
        )}

        {/* Stappenformulier */}
        {!klaar && (
          <>
            {/* Voortgangsbalk */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {stappen.map((s, i) => (
                <div key={s.id} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= stapIndex ? blauw : '#e2e8f0', transition: 'background 0.3s' }} />
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
              <p style={{ color: groen, fontWeight: '600', fontSize: '0.8rem', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>STAP {stapIndex + 1} VAN {stappen.length}</p>
              <h2 style={{ color: blauw, marginTop: 0, marginBottom: '0.75rem' }}>{huidigeStap.titel}</h2>
              <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '2rem', fontSize: '0.95rem' }}>{huidigeStap.intro}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {huidigeStap.vragen.map((vraag) => (
                  <div key={vraag.id}>
                    <label style={{ fontWeight: '600', color: '#222', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>{vraag.label}</label>
                    <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 0.75rem', lineHeight: '1.5', fontStyle: 'italic' }}>💡 {vraag.tip}</p>

                    {vraag.type === 'select' && (
                      <select value={antwoorden[vraag.id] || ''} onChange={(e) => handleAntwoord(vraag.id, e.target.value)} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', background: 'white' }}>
                        <option value="">Kies een optie...</option>
                        {vraag.opties.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}

                    {vraag.type === 'check' && (
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: '8px', background: antwoorden[vraag.id] ? '#f0fdf4' : '#f8f9fa', border: antwoorden[vraag.id] ? `1px solid ${groen}` : '1px solid #eee', transition: 'all 0.2s' }}>
                        <input type="checkbox" checked={!!antwoorden[vraag.id]} onChange={(e) => handleAntwoord(vraag.id, e.target.checked)} style={{ marginTop: '2px', accentColor: groen, width: '16px', height: '16px', flexShrink: 0 }} />
                        <span style={{ color: '#444', fontSize: '0.9rem', lineHeight: '1.5' }}>Ja, dit is van toepassing</span>
                      </label>
                    )}

                    {vraag.type === 'slider' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>Laag</span>
                          <span style={{ fontWeight: 'bold', color: blauw, fontSize: '1.2rem' }}>{antwoorden[vraag.id] || 5}/10</span>
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>Hoog</span>
                        </div>
                        <input type="range" min="1" max="10" value={antwoorden[vraag.id] || 5} onChange={(e) => handleAntwoord(vraag.id, parseInt(e.target.value))} style={{ width: '100%', accentColor: blauw }} />
                      </div>
                    )}

                    {vraag.type === 'tekst' && (
                      <textarea value={antwoorden[vraag.id] || ''} onChange={(e) => handleAntwoord(vraag.id, e.target.value)} rows={3} placeholder="Noteer hier wat je hebt gehoord..." style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {stapIndex > 0 && (
                <button onClick={() => setStapIndex(stapIndex - 1)} style={{ padding: '0.85rem 2rem', background: 'white', color: blauw, border: `1px solid ${blauw}`, borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  ← Terug
                </button>
              )}
              {stapIndex < stappen.length - 1 ? (
                <button onClick={() => setStapIndex(stapIndex + 1)} style={{ padding: '0.85rem 2rem', background: blauw, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  Volgende stap →
                </button>
              ) : (
                <button onClick={handleOpslaan} style={{ padding: '0.85rem 2rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                  Bekijk mijn score ✓
                </button>
              )}
              {opgeslagen && <p style={{ color: groen, fontWeight: '600', margin: 'auto 0' }}>✓ Opgeslagen!</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MijnOrganisatie