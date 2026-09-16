import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const groen = '#00A99D'
const groenDark = '#1A3080'

const beperkingenUitgebreid = [
  {
    nr: 1,
    titel: 'Fysiek / motorisch',
    tekst: `Fysieke en motorische beperkingen verschillen enorm van persoon tot persoon. De een gebruikt een rolstoel, de ander een loophulpmiddel, en weer iemand anders heeft een beperkte handfunctie of ongecontroleerde bewegingen zoals spasmen. Dat speelt mee bij alledaagse dingen: eten en drinken, of het vasthouden van een glas of programmaboekje.

Iets om je bewust van te zijn: een fysieke beperking zegt niets over iemands denkvermogen. Toch worden mensen die een rolstoel gebruiken of spasmen hebben vaak anders behandeld — bijvoorbeeld doordat mensen langzamer tegen hen gaan praten of zich richten tot de persoon die met hen mee is. Word je bewust van zulke aannames en wacht even met je reactie.`,
    inCultuur: 'trappen zonder lift of hellingbaan, smalle deuren, drempels, hoge balies en bars, geen plek om te rusten, podia die alleen via een trap bereikbaar zijn (ook voor artiesten).',
    watHelpt: 'een lager deel van de balie of bar, een hellingbaan, rustpunten met een zitplek, een toegankelijk podium, ruime en obstakelvrije routes, een stabiele plek om iets neer te zetten (ook op rolstoelhoogte), en drinken met een rietje.',
  },
  {
    nr: 2,
    titel: 'Zintuiglijk',
    tekst: `Zien: tussen slechtziend en blind zit van alles. Denk aan kokervisie (alleen een klein gebied in het midden), een blinde vlek juist in het midden, wazig zien of kleurenblindheid. De behoefte aan licht verschilt ook: de een heeft juist veel licht nodig, de ander raakt overprikkeld door fel licht.

Horen: tussen slechthorend en doof zit veel. Denk aan tinnitus, moeite om spraak uit achtergrondlawaai te filteren, of gehoorverlies aan één kant. De behoeften verschillen: de een gebruikt gebarentaal, de ander leest mee van de lippen, en weer iemand anders heeft juist een rustige, galmvrije ruimte nodig.

Meestal denken we bij zintuiglijk aan zien en horen (of allebei: doofblindheid). Maar we hebben meer zintuigen: ook tast, reuk en smaak. In cultuur zijn tast en smaak vaak een kans — denk aan voelbare kunst en tastmodellen, of werk waarin geur en smaak worden ingezet. Andersom kunnen zintuigen ook overweldigen: fel licht, harde geluiden, sterke geuren of bepaalde texturen kunnen voor de één te veel worden.`,
    inCultuur: 'informatie die alleen visueel of alleen hoorbaar is, slecht contrast, beeld zonder gesproken uitleg, gesproken informatie zonder alternatief.',
    watHelpt: 'audiodescriptie, voelbare en tastbare elementen, goed contrast en grote letters, ondertiteling, een gebarentolk, een ringleiding, visuele ondersteuning bij gesproken tekst, en dove artiesten (deaf performers) op het podium.',
  },
  {
    nr: 3,
    titel: 'Verstandelijk',
    tekst: `Hoe sterk een verstandelijke beperking speelt, verschilt sterk per persoon. Vaak gaat het om moeite met lezen, met ingewikkelde informatie, of met taken die uit veel handelingen bestaan.

Belangrijk: een verstandelijke beperking zegt niets over iemands gevoel, humor of smaak. Behandel volwassenen dus als volwassenen, niet als kinderen. En bedenk dat duidelijke taal een veel grotere groep helpt — ook laaggeletterdheid en een andere moedertaal spelen mee.`,
    inCultuur: 'ingewikkelde teksten, abstracte uitleg, onduidelijke routing, een aankoopproces met veel handelingen, weinig beeld of voorbeelden.',
    watHelpt: 'duidelijke taal, pictogrammen en beeld, informatie in kleine, behapbare stukjes, een rustige ontvangst, en de mogelijkheid om een begeleider mee te nemen (bijvoorbeeld gratis toegang voor een begeleider).',
  },
  {
    nr: 4,
    titel: 'Cognitief en neurodivergent',
    tekst: `Neurodivergent betekent simpelweg: een brein dat op een andere manier werkt dan gemiddeld. Een brein dat wel binnen de gangbare norm valt, noemen we neurotypisch. Geen van beide is beter of slechter. Het is breder dan autisme en ADHD alleen: denk ook aan dyslexie, niet-aangeboren hersenletsel, dementie of epilepsie.

En het is niet vast: door ouderdom, ziekte of ingrijpende ervaringen kan iedereen neurodivergent worden. Vaak horen er ook krachten bij, zoals scherpe focus, gevoel voor detail of een eigen creativiteit.

De kunst is om mensen zich niet te laten aanpassen aan de norm, maar om de omgeving zo in te richten dat veel meer mensen zich er prettig in voelen. Zoals de Code Diversiteit & Inclusie het stelt: "Eigenschappen als snelheid, extraversie of constante beschikbaarheid zijn geen neutrale maatstaven voor talent."`,
    inCultuur: 'veel prikkels tegelijk (geluid, licht, drukte), onvoorspelbaarheid, tijdsdruk, lange lappen tekst, plotselinge harde geluiden of flitsen.',
    watHelpt: 'een prikkelarme ruimte of rustmoment, vooraf duidelijk maken wat mensen kunnen verwachten (bijvoorbeeld aankondiging van harde momenten), voorspelbare routing, koptelefoons, rustige bezoekmomenten.',
  },
  {
    nr: 5,
    titel: 'Psychisch / mentaal',
    tekst: `Psychische beperkingen zijn vaak onzichtbaar, wisselen per dag, en zijn met veel vooroordelen omgeven. Denk aan angst, depressie, of de doorwerking van ingrijpende ervaringen. Ze zijn geen teken van zwakte: hoe iemand zich voelt, hangt sterk samen met wat diegene heeft meegemaakt en met de omgeving van nu.

Wat vaak het meest helpt is voorspelbaarheid, een veilige sfeer, en het gevoel dat je zelf de regie houdt: dat je mag komen en gaan op je eigen tempo.`,
    inCultuur: 'sociale druk, onduidelijkheid over de gang van zaken, geen mogelijkheid om zich even terug te trekken, drukte zonder uitweg.',
    watHelpt: 'heldere informatie vooraf, een rustige terugtrekplek, vriendelijk personeel dat niet oordeelt, de vrijheid om op je eigen tempo mee te doen, en de mogelijkheid om een kaartje te annuleren of om te boeken.',
  },
  {
    nr: 6,
    titel: 'Chronische ziekte en energiebeperking',
    tekst: `Veel mensen leven met een chronische ziekte, bijvoorbeeld ME of langdurige covid, een auto-immuunziekte, pijn of extreme vermoeidheid. Zulke ziekten zijn vaak onzichtbaar en verschillen per dag.

Een handige uitleg is de lepelmetafoor: je hebt maar een beperkt aantal "lepels" energie per dag, en alles kost er een paar — van reizen tot een drukke zaal. Op is op, en rust vult de voorraad langzaam weer aan.`,
    inCultuur: 'lange programma\'s zonder pauze, lang staan of in de rij, grote afstanden binnen een gebouw, geen plek om te zitten, en kaartjes die je niet kunt omruilen als je die dag niet kunt.',
    watHelpt: 'zitplekken en rustruimtes, pauzes, korte afstanden of vervoer ter plekke, vooraf duidelijkheid over duur en afstanden, flexibele of terug te betalen kaartjes, en soms een online-alternatief.',
  },
]

const bronnen = [
  { titel: 'Cijfers over beperkingen', bron: 'CBS, Emancipatiemonitor 2024', url: 'https://longreads.cbs.nl/emancipatiemonitor-2024/leven-met-beperkingen/' },
  { titel: 'VN-verdrag Handicap', bron: 'College voor de Rechten van de Mens', url: 'https://www.mensenrechten.nl/themas/rechten-van-mensen-met-een-beperking' },
  { titel: 'Uitleg over beperkingen', bron: 'HandicapNL', url: 'https://handicap.nl/wat-is-een-handicap-en-welke-zijn-er-dan-allemaal/' },
  { titel: 'Prikkelgevoeligheid en neurodiversiteit', bron: 'Jenara Nerenberg — Divergent Mind', url: 'https://greatergood.berkeley.edu/article/item/how_to_deal_with_sensory_overload_as_a_sensitive_person' },
  { titel: 'Neurodivergentie en radicale inclusie', bron: 'Code Diversiteit & Inclusie', url: 'https://codedi.nl/neurodivergentie-is-breder-dan-je-denkt-een-pleidooi-voor-radicale-inclusie' },
  { titel: 'Energiebeperking en de lepelmetafoor', bron: 'Wikipedia', url: 'https://nl.wikipedia.org/wiki/Lepelmetafoor' },
  { titel: 'Psychische gezondheid en destigmatisering', bron: 'Samen Sterk Zonder Stigma', url: 'https://samensterkzonderstigma.nl' },
  { titel: 'Code Diversiteit & Inclusie en de vier P\'s', bron: 'codedi.nl', url: 'https://codedi.nl' },
  { titel: 'Experts en ervaringsdeskundigen benaderen', bron: 'het Loket van Code D&I', url: 'https://codedi.nl/loket' },
  { titel: 'Toegankelijkheidsbeleid van de stad', bron: 'Den Haag Toegankelijke Stad', url: 'https://www.denhaag.nl/nl/beleid-en-regelgeving/den-haag-toegankelijke-stad/' },
]

function Verdieping() {
  const [user] = useAuthState(auth)
  const [profiel, setProfiel] = useState(null)
  const [voortgang, setVoortgang] = useState({})
  const [isMobiel, setIsMobiel] = useState(window.innerWidth < 768)
  const [uitgeklapt, setUitgeklapt] = useState({})
  const navigate = useNavigate()

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
      if (snap.exists()) {
        setProfiel(snap.data())
        setVoortgang(snap.data().voortgang || {})
      }
    }
    haal()
  }, [user])

  const toggle = (nr) => setUitgeklapt({ ...uitgeklapt, [nr]: !uitgeklapt[nr] })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f4f2ee' }}>
      <Sidebar actief="verdieping" voortgang={voortgang} profiel={profiel} />

      <main style={{ marginLeft: isMobiel ? 0 : '220px', padding: isMobiel ? '4rem 1.25rem 2rem' : '2.5rem', flex: 1, maxWidth: isMobiel ? '100%' : '780px' }}>

        <p style={{ color: groen, fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Verdieping</p>
        <h1 style={{ color: '#1a1a1a', marginBottom: '0.5rem', fontSize: isMobiel ? '1.5rem' : '1.9rem' }}>
          De sociale benadering & beperkingen uitgebreid
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.65' }}>
          Meer achtergrond bij het thema toegankelijkheid en de zes categorieën beperkingen.
        </p>

        {/* Sociale benadering */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: '1.5rem', borderLeft: `4px solid ${groen}` }}>
          <h2 style={{ color: groenDark, marginTop: 0, marginBottom: '0.75rem', fontSize: '1.15rem' }}>De sociale benadering van beperking</h2>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Vroeger dachten we dat een beperking iets van de persoon zelf was: er is iets "mis" dat gerepareerd moet worden. Het VN-verdrag Handicap denkt daar anders over. Een beperking ontstaat namelijk in de botsing tussen iemands lijf of brein en een omgeving die daar geen rekening mee houdt. Dat noemen we de <strong>sociale benadering</strong>.
          </p>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Een voorbeeld: iemand die doof is, kan een tentoonstelling met duidelijke tekstborden en beeld prima volgen. Maar een rondleiding die alleen gesproken wordt, mist die persoon volledig. De drempel zit dus niet in de persoon, maar in de keuze om de informatie op maar één manier aan te bieden. Dat is bevrijdend: aan een gebouw, een programma of een werkwijze kún je iets veranderen.
          </p>
          <p style={{ color: '#333', lineHeight: '1.75', fontSize: '0.95rem', margin: 0 }}>
            Voor sommige mensen is hun beperking juist deel van hun identiteit, of zelfs een kracht. Denk aan dove mensen voor wie gebarentaal een volwaardige taal en cultuur is. Of aan neurodivergente makers die vanuit een ander perspectief nieuwe vormen vinden. Toegankelijkheid gaat dus niet over "repareren", maar over gelijkwaardig meedoen. En over de rijkdom die ontstaat als meer perspectieven meedoen.
          </p>
        </div>

        <h2 style={{ color: '#1a1a1a', margin: '2rem 0 0.5rem', fontSize: '1.15rem' }}>Beperkingen van dichtbij</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.65' }}>
          In het echt overlappen deze categorieën en heeft iemand soms meerdere beperkingen tegelijk. Deze zes zijn dus houvast, geen vaste hokjes. Klik op een categorie om meer te lezen.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {beperkingenUitgebreid.map((b) => (
            <div key={b.nr} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div onClick={() => toggle(b.nr)}
                style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: groen, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: '700', flexShrink: 0 }}>
                  {b.nr}
                </div>
                <h3 style={{ margin: 0, color: groenDark, fontSize: '1rem', fontWeight: '700', flex: 1 }}>{b.titel}</h3>
                <span style={{ color: groen, fontSize: '1.1rem' }}>{uitgeklapt[b.nr] ? '−' : '+'}</span>
              </div>
              {uitgeklapt[b.nr] && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f0f0f0' }}>
                  {b.tekst.split('\n\n').map((alinea, i) => (
                    <p key={i} style={{ color: '#333', lineHeight: '1.75', fontSize: '0.92rem', margin: '1rem 0' }}>{alinea}</p>
                  ))}
                  <div style={{ background: '#f0fafa', borderRadius: '8px', padding: '0.875rem 1rem', marginTop: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: groenDark }}>
                      <strong>In cultuur:</strong> {b.inCultuur}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: groenDark }}>
                      <strong style={{ color: groen }}>Wat helpt:</strong> {b.watHelpt}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bronnen */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '1rem', fontSize: '1.05rem' }}>Bronnen & meer lezen</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {bronnen.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer"
                style={{ color: groenDark, textDecoration: 'none', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#f0fafa', display: 'block', transition: 'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#E0F5F4'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f0fafa'}>
                <div style={{ fontSize: '0.88rem', fontWeight: '600', marginBottom: '2px' }}>{b.titel}</div>
                <div style={{ fontSize: '0.78rem', color: '#666' }}>{b.bron} ↗</div>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default Verdieping