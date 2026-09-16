import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import theaterFoto from '../assets/theater.jpg'
import logoCommunity from '../assets/InCultuur-community.webp'
import logoDenHaag from '../assets/logo-denhaag.webp'

const groen = '#00A99D'
const groenDark = '#1A3080'

const beperkingen = [
  {
    titel: 'Fysiek / motorisch',
    kort: 'Bewegen, kracht, uithoudingsvermogen. Bijvoorbeeld rolstoelgebruikers, MS, dwarslaesie, spasmen.',
    helpt: 'Hellingbaan, lage balie, ruime obstakelvrije routes, zitplekken.',
    verdieping: `Fysieke en motorische beperkingen verschillen enorm van persoon tot persoon. De een gebruikt een rolstoel, de ander een loophulpmiddel, en weer iemand anders heeft een beperkte handfunctie of ongecontroleerde bewegingen zoals spasmen. Dat speelt mee bij alledaagse dingen: eten en drinken, of het vasthouden van een glas of programmaboekje.

Iets om je bewust van te zijn: een fysieke beperking zegt niets over iemands denkvermogen. Toch worden mensen die een rolstoel gebruiken of spasmen hebben vaak anders behandeld — bijvoorbeeld doordat mensen langzamer tegen hen gaan praten of zich richten tot de persoon die met hen mee is. Word je bewust van zulke aannames en wacht even met je reactie.`,
    inCultuur: 'trappen zonder lift of hellingbaan, smalle deuren, drempels, hoge balies en bars, geen plek om te rusten, podia die alleen via een trap bereikbaar zijn (ook voor artiesten).',
  },
  {
    titel: 'Zintuiglijk',
    kort: 'Zien, horen, tast, reuk of smaak. Blinde en slechtziende, dove en slechthorende mensen.',
    helpt: 'Ondertiteling, audiodescriptie, gebarentolk, voelbare elementen, goed contrast.',
    verdieping: `Zien: tussen slechtziend en blind zit van alles. Denk aan kokervisie, een blinde vlek juist in het midden, wazig zien of kleurenblindheid. De behoefte aan licht verschilt ook: de een heeft juist veel licht nodig, de ander raakt overprikkeld door fel licht.

Horen: tussen slechthorend en doof zit veel. Denk aan tinnitus, moeite om spraak uit achtergrondlawaai te filteren, of gehoorverlies aan één kant. De behoeften verschillen: de een gebruikt gebarentaal, de ander leest mee van de lippen, en weer iemand anders heeft juist een rustige, galmvrije ruimte nodig.

Meestal denken we bij zintuiglijk aan zien en horen. Maar we hebben meer zintuigen: ook tast, reuk en smaak. In cultuur zijn tast en smaak vaak een kans — denk aan voelbare kunst en tastmodellen, of werk waarin geur en smaak worden ingezet. Andersom kunnen zintuigen ook overweldigen: fel licht, harde geluiden, sterke geuren of bepaalde texturen kunnen voor de één te veel worden.`,
    inCultuur: 'informatie die alleen visueel of alleen hoorbaar is, slecht contrast, beeld zonder gesproken uitleg, gesproken informatie zonder alternatief.',
  },
  {
    titel: 'Verstandelijk',
    kort: 'Leren, begrijpen en zelfstandig handelen. Ook laaggeletterdheid en andere moedertaal spelen mee.',
    helpt: 'Duidelijke taal, pictogrammen en beeld, kleine behapbare stukjes.',
    verdieping: `Hoe sterk een verstandelijke beperking speelt, verschilt sterk per persoon. Vaak gaat het om moeite met lezen, met ingewikkelde informatie, of met taken die uit veel handelingen bestaan.

Belangrijk: een verstandelijke beperking zegt niets over iemands gevoel, humor of smaak. Behandel volwassenen dus als volwassenen, niet als kinderen. En bedenk dat duidelijke taal een veel grotere groep helpt — ook laaggeletterdheid en een andere moedertaal spelen mee.`,
    inCultuur: 'ingewikkelde teksten, abstracte uitleg, onduidelijke routing, een aankoopproces met veel handelingen, weinig beeld of voorbeelden.',
  },
  {
    titel: 'Cognitief en neurodivergent',
    kort: 'Een brein dat op andere manier werkt: autisme, ADHD, dyslexie, dementie, hersenletsel.',
    helpt: 'Prikkelarme ruimte, vooraf duidelijk maken wat mensen kunnen verwachten, voorspelbare routing.',
    verdieping: `Neurodivergent betekent simpelweg: een brein dat op een andere manier werkt dan gemiddeld. Een brein dat wel binnen de gangbare norm valt, noemen we neurotypisch. Geen van beide is beter of slechter. Het is breder dan autisme en ADHD alleen: denk ook aan dyslexie, niet-aangeboren hersenletsel, dementie of epilepsie.

Het is niet vast: door ouderdom, ziekte of ingrijpende ervaringen kan iedereen neurodivergent worden. Vaak horen er ook krachten bij, zoals scherpe focus, gevoel voor detail of een eigen creativiteit.

De kunst is om mensen zich niet te laten aanpassen aan de norm, maar om de omgeving zo in te richten dat veel meer mensen zich er prettig in voelen.`,
    inCultuur: 'veel prikkels tegelijk (geluid, licht, drukte), onvoorspelbaarheid, tijdsdruk, lange lappen tekst, plotselinge harde geluiden of flitsen.',
  },
  {
    titel: 'Psychisch / mentaal',
    kort: 'Angst, depressie, overprikkeld raken. Vaak onzichtbaar en wisselend per dag.',
    helpt: 'Heldere informatie vooraf, rustige terugtrekplek, vrijheid om eigen tempo te bepalen.',
    verdieping: `Psychische beperkingen zijn vaak onzichtbaar, wisselen per dag, en zijn met veel vooroordelen omgeven. Denk aan angst, depressie, of de doorwerking van ingrijpende ervaringen. Ze zijn geen teken van zwakte: hoe iemand zich voelt, hangt sterk samen met wat diegene heeft meegemaakt en met de omgeving van nu.

Wat vaak het meest helpt is voorspelbaarheid, een veilige sfeer, en het gevoel dat je zelf de regie houdt: dat je mag komen en gaan op je eigen tempo.`,
    inCultuur: 'sociale druk, onduidelijkheid over de gang van zaken, geen mogelijkheid om zich even terug te trekken, drukte zonder uitweg.',
  },
  {
    titel: 'Chronische ziekte en energiebeperking',
    kort: 'ME, langdurige covid, pijn, extreme vermoeidheid. Vaak onzichtbaar, per dag verschillend.',
    helpt: 'Zitplekken en rustruimtes, pauzes, flexibele kaartjes, korte afstanden.',
    verdieping: `Veel mensen leven met een chronische ziekte, bijvoorbeeld ME of langdurige covid, een auto-immuunziekte, pijn of extreme vermoeidheid. Zulke ziekten zijn vaak onzichtbaar en verschillen per dag.

Een handige uitleg is de lepelmetafoor: je hebt maar een beperkt aantal "lepels" energie per dag, en alles kost er een paar — van reizen tot een drukke zaal. Op is op, en rust vult de voorraad langzaam weer aan.`,
    inCultuur: 'lange programma\'s zonder pauze, lang staan of in de rij, grote afstanden binnen een gebouw, geen plek om te zitten, en kaartjes die je niet kunt omruilen als je die dag niet kunt.',
  },
]

const inzichten = [
  { titel: 'Niet-zichtbaar is de regel, niet de uitzondering', tekst: 'De meeste beperkingen merk je niet aan iemand. Maak dingen daarom standaard toegankelijk, in plaats van pas als iemand erom vraagt.' },
  { titel: 'Toegankelijkheid helpt vaak een brede groep, maar niet altijd iedereen tegelijk', tekst: 'Heldere taal, contrast, rustplekken en duidelijke routing zijn fijn voor bijna iedereen. Tegelijk botsen behoeften soms — een gladde vloer prettig voor rolstoelgebruikers kan lastig zijn voor iemand met een kruk. De perfecte oplossing bestaat niet altijd. En dat is oké.' },
  { titel: 'Niet alles hoeft in één keer perfect', tekst: 'Je kunt niet alles 100% toegankelijk maken voor 100% van de mensen. Maak keuzes, maar maak ze bewust. Begin, en durf fouten te maken.' },
  { titel: 'Niets over ons, zonder ons', tekst: 'Dat is al decennia de leus van de gehandicaptenbeweging. Vul nooit voor een ander in wat diegene nodig heeft, maar bedenk toegankelijkheid mét de mensen om wie het gaat en toets je keuzes bij hen.' },
]

function Basiskennis() {
  const { stap } = useParams()
  const stapNr = parseInt(stap) || 1
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const [uitgeklapt, setUitgeklapt] = useState({})
  const [toonSociaal, setToonSociaal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => setIsMobiel(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (user === null) navigate('/login')
    if (!user) return
    const haal = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) setProfiel(snap.data())
    }
    haal()
  }, [user])

  useEffect(() => { window.scrollTo(0, 0) }, [stapNr])

  if (!profiel) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>

  const totaalStappen = 3
  const volgende = () => {
    if (stapNr < totaalStappen) navigate(`/basiskennis/${stapNr + 1}`)
    else navigate('/modules-uitleg')
  }
  const vorige = () => {
    if (stapNr > 1) navigate(`/basiskennis/${stapNr - 1}`)
  }

  const toggle = (i) => setUitgeklapt({ ...uitgeklapt, [i]: !uitgeklapt[i] })

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: isMobiel ? 0 : '2rem', background: groenDark, overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${theaterFoto})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, background: 'white', borderRadius: isMobiel ? '0' : '16px', padding: isMobiel ? '1.75rem 1.25rem' : '3rem', maxWidth: '760px', width: '100%', boxShadow: isMobiel ? 'none' : '0 8px 40px rgba(0,0,0,0.2)', minHeight: isMobiel ? '100vh' : 'auto' }}>

        {/* Voortgang */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ height: '3px', flex: 1, borderRadius: '2px', background: s <= stapNr ? groen : '#e0e0e0', transition: 'background 0.3s' }} />
          ))}
        </div>

        <p style={{ color: groen, fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
          Basiskennis · Stap {stapNr} van {totaalStappen}
        </p>

        {/* STAP 1 */}
        {stapNr === 1 && (
          <>
            <h1 style={{ color: groenDark, fontSize: isMobiel ? '1.5rem' : '1.9rem', margin: '0 0 0.5rem', fontWeight: '700', lineHeight: '1.2' }}>
              Welkom bij de InCultuur Boost, {profiel.naam}!
            </h1>
            <p style={{ color: '#444', fontSize: '1rem', margin: '0 0 1.75rem', fontStyle: 'italic' }}>
              Toegankelijkheid & inclusie voor de cultuursector
            </p>

            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.98rem', marginBottom: '1rem' }}>
              Cultuur werkt pas echt als iedereen kan meedoen. Als bezoeker, maker, artiest, medewerker, vrijwilliger of organisator. Toch komen mensen nog dagelijks drempels tegen: een ingang die alleen via een trap bereikbaar is, een tekst vol moeilijke woorden, een programma waarin ze zichzelf niet herkennen.
            </p>
            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.98rem', marginBottom: '2rem' }}>
              De InCultuur Boost geeft je in vier korte modules een boost in kennis en motivatie om daar iets aan te doen. Niet omdat het moet, maar omdat het je relevantie en impact vergroot. En ook gewoon omdat het leuk en dankbaar is.
            </p>

            <div style={{ background: '#E0F5F4', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', borderLeft: `4px solid ${groen}` }}>
              <h2 style={{ color: groenDark, fontSize: '1.1rem', margin: '0 0 0.75rem' }}>Twee uitgangspunten</h2>
              <p style={{ color: '#333', lineHeight: '1.7', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                In de hele Boost komen twee dingen steeds terug. Hou ze in je achterhoofd bij alles wat je maakt en organiseert.
              </p>
              <p style={{ color: '#333', lineHeight: '1.7', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                <strong>Een vraag:</strong> hebben mensen een beperking, of leggen ontoegankelijke plekken, activiteiten en gewoontes sommige mensen (onbedoeld) beperkingen op?
              </p>
              <p style={{ color: '#333', lineHeight: '1.7', fontSize: '0.92rem', margin: 0 }}>
                <strong>Een principe:</strong> bedenk toegankelijkheid niet vóór mensen, maar mét hen. Zoek contact met je doelgroep, betrek ervaringsdeskundigen en toets je keuzes bij hen.
              </p>
            </div>

            <h2 style={{ color: groenDark, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>Waarom dit telt</h2>
            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Volgens het CBS had in 2023 ongeveer <strong>3 op de 10 mensen</strong> van 15 tot 65 jaar een beperking in het dagelijks leven. Veel van die beperkingen merk je niet aan iemand.
            </p>
            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Toegankelijkheid is bovendien geen extra service, maar een <strong>recht</strong>. Het VN-verdrag Handicap (2006, in Nederland van kracht sinds 2016) bepaalt dat iedereen recht heeft op gelijke toegang tot cultuur, informatie, communicatie en voorzieningen.
            </p>
            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '2rem' }}>
              De culturele sector geeft er invulling aan met de <strong>Code Diversiteit & Inclusie</strong>, langs vier lijnen: programma, publiek, personeel en partners.
            </p>

            <button onClick={volgende} style={{ width: '100%', padding: '1rem', background: groen, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
              Volgende: wat is een beperking? →
            </button>
          </>
        )}

        {/* STAP 2 */}
        {stapNr === 2 && (
          <>
            <h1 style={{ color: groenDark, fontSize: isMobiel ? '1.5rem' : '1.75rem', margin: '0 0 1.25rem', fontWeight: '700', lineHeight: '1.25' }}>
              Wat is een beperking?
            </h1>

            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Vaak denken we dat een beperking in de persoon zelf zit. Maar vaak ligt het aan de omgeving. Iemand die slecht ziet, wordt pas "beperkt" als informatie alleen op één manier wordt aangeboden. <strong>Verander de omgeving, en de beperking verdwijnt of wordt kleiner.</strong>
            </p>
            <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              En waar jij als cultuurprofessional invloed op hebt, is die omgeving: hoe we onze plekken, programma's en communicatie inrichten. Dat is goed nieuws.
            </p>

            {/* Uitklapbare sociale benadering */}
            <div style={{ background: '#EFEDFC', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #d4cff2', overflow: 'hidden' }}>
              <div onClick={() => setToonSociaal(!toonSociaal)} style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6B5ECC', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>Meer weten</div>
                  <div style={{ fontSize: '0.9rem', color: '#3D3280', fontWeight: '600' }}>De sociale benadering van beperking</div>
                </div>
                <span style={{ color: '#6B5ECC', fontSize: '1.25rem', fontWeight: '700' }}>{toonSociaal ? '−' : '+'}</span>
              </div>
              {toonSociaal && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(107,94,204,0.2)' }}>
                  <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.9rem', margin: '1rem 0' }}>
                    Vroeger dachten we dat een beperking iets van de persoon zelf was: er is iets "mis" dat gerepareerd moet worden. Het VN-verdrag Handicap denkt daar anders over. Een beperking ontstaat namelijk in de botsing tussen iemands lijf of brein en een omgeving die daar geen rekening mee houdt. Dat noemen we de <strong>sociale benadering</strong>.
                  </p>
                  <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.9rem', margin: '1rem 0' }}>
                    Een voorbeeld: iemand die doof is, kan een tentoonstelling met duidelijke tekstborden en beeld prima volgen. Maar een rondleiding die alleen gesproken wordt, mist die persoon volledig. De drempel zit dus niet in de persoon, maar in de keuze om de informatie op maar één manier aan te bieden. Dat is bevrijdend: aan een gebouw, een programma of een werkwijze kún je iets veranderen.
                  </p>
                  <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.9rem', margin: '1rem 0 0' }}>
                    Voor sommige mensen is hun beperking juist deel van hun identiteit, of zelfs een kracht. Denk aan dove mensen voor wie gebarentaal een volwaardige taal en cultuur is. Toegankelijkheid gaat dus niet over "repareren", maar over gelijkwaardig meedoen.
                  </p>
                </div>
              )}
            </div>

            <h2 style={{ color: groenDark, fontSize: '1.05rem', margin: '0 0 0.75rem' }}>Zes veelvoorkomende beperkingen</h2>
            <p style={{ color: '#555', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Er zijn veel verschillende beperkingen. Deze zes komen vaak voor. Klik op een categorie voor meer uitleg.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
              {beperkingen.map((b, i) => (
                <div key={i} style={{ background: '#f0fafa', borderRadius: '10px', borderLeft: `3px solid ${groen}`, overflow: 'hidden' }}>
                  <div onClick={() => toggle(i)} style={{ padding: '0.875rem 1.1rem', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700', flexShrink: 0, marginTop: '2px' }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ color: groenDark, fontSize: '0.95rem', margin: '0 0 0.3rem', fontWeight: '700' }}>{b.titel}</h3>
                        <p style={{ color: '#333', fontSize: '0.85rem', lineHeight: '1.55', margin: '0 0 0.4rem' }}>{b.kort}</p>
                        <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>
                          <strong style={{ color: groen }}>Wat helpt:</strong> {b.helpt}
                        </p>
                      </div>
                      <span style={{ color: groen, fontSize: '1.1rem', fontWeight: '700', flexShrink: 0 }}>{uitgeklapt[i] ? '−' : '+'}</span>
                    </div>
                  </div>
                  {uitgeklapt[i] && (
                    <div style={{ padding: '0 1.1rem 1.1rem 2.5rem', borderTop: '1px solid #e0f0ef' }}>
                      {b.verdieping.split('\n\n').map((alinea, j) => (
                        <p key={j} style={{ color: '#333', lineHeight: '1.7', fontSize: '0.85rem', margin: '0.75rem 0' }}>{alinea}</p>
                      ))}
                      <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: '1.55', margin: '0.75rem 0 0', background: 'white', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                        <strong style={{ color: groenDark }}>In cultuur:</strong> {b.inCultuur}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={vorige} style={{ flex: 1, padding: '0.9rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>
                ← Terug
              </button>
              <button onClick={volgende} style={{ flex: 2, padding: '0.9rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
                Volgende: vier inzichten →
              </button>
            </div>
          </>
        )}

        {/* STAP 3 */}
        {stapNr === 3 && (
          <>
            <h1 style={{ color: groenDark, fontSize: isMobiel ? '1.5rem' : '1.75rem', margin: '0 0 1.25rem', fontWeight: '700', lineHeight: '1.25' }}>
              Vier inzichten om mee te nemen
            </h1>
            <p style={{ color: '#444', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Deze vier gedachten helpen je door de rest van de Boost. Ze komen in elke module ergens terug.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {inzichten.map((inz, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '700', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: groenDark, fontSize: '0.98rem', fontWeight: '700', lineHeight: '1.35' }}>{inz.titel}</h3>
                    <p style={{ margin: 0, color: '#444', lineHeight: '1.65', fontSize: '0.9rem' }}>{inz.tekst}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#FDF0DC', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', border: '1px solid #f0d090' }}>
              <p style={{ color: '#5a3a0a', margin: 0, fontSize: '0.92rem', lineHeight: '1.65' }}>
                <strong>Klaar voor de modules?</strong> Elke module duurt ongeveer 20 minuten. Doe je alle vier? Reken op zo'n anderhalf uur, verdeeld over zoveel momenten als je wilt.
              </p>
            </div>

            <p style={{ color: '#666', fontSize: '0.78rem', textAlign: 'center', marginBottom: '0.75rem', lineHeight: '1.6' }}>
              De InCultuur Boost is een initiatief van InCultuur Community,<br />
              mogelijk gemaakt door de Gemeente Den Haag / Toegankelijke Stad
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <img src={logoCommunity} alt="InCultuur Community" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <img src={logoDenHaag} alt="Gemeente Den Haag" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={vorige} style={{ flex: 1, padding: '0.9rem', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>
                ← Terug
              </button>
              <button onClick={volgende} style={{ flex: 2, padding: '0.9rem', background: groen, color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }}>
                Naar de modules →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Basiskennis