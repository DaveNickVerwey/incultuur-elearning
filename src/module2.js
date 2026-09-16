// Module 2 - Makers van bereik
// Volledige inhoud, uitklap per rol en bronnen

import module2Sub1 from './assets/module2/module2-sub1.webp'
import module2Sub3 from './assets/module2/module2-sub3.webp'
import module2Sub4 from './assets/module2/module2-sub4.webp'

export const module2 = {
  nr: 2,
  titel: 'Makers van bereik',
  subtitel: 'Communicatie zonder drempels',
  doelgroep: 'Voor marketeers en contentmakers, voor iedereen die betrokken is bij de verkoop, en voor publieksmedewerkers en vrijwilligers die bezoekers ontvangen. Samen bepalen jullie hoe iemand het zoeken, het bestellen, de binnenkomst, en de terugweg naar huis ervaart.',
  duur: '20-25 min',

  intro: {
    hero: {
      titel: 'Wat weten mensen van jullie, nog voordat ze binnen zijn?',
      vragen: [
        'Kan iemand op je website vinden of een bezoek gaat lukken?',
        'Kan iemand zelf een kaartje kopen dat past?',
        'En klopt bij de ingang wat er vooraf is beloofd?',
      ],
    },
    tijdsindicatie: 'Ongeveer 20 tot 25 minuten. Zo\'n 13 tot 14 minuten lezen, de rest is voor je reflectie en je actie. Dat is een richtlijn, geen norm: neem gerust meer tijd en stop gerust tussendoor. Je kunt later verder waar je gebleven was.',

    subStapFotos: [
      { src: module2Sub1, alt: 'Handen houden een smartphone vast, iemand scrolt door een website of app.' },
      null, // sub-stap 2: bewust geen foto
      { src: module2Sub3, alt: 'Twee mensen zitten samen aan een tafel, één wijst op een laptopscherm en overlegt met de ander.' },
      { src: module2Sub4, alt: 'Twee mensen zitten aan een houten tafel op een kleurrijke tegelvloer, van bovenaf gezien, in gesprek met elkaar.' },
    ],

    secties: [
      {
        titel: 'Van begin tot eind',
        alineas: [
          'Voor een deel van je publiek begint een bezoek weken eerder, met één vraag: ben ik welkom? Jullie werk weegt zwaar in het antwoord: een tekst, een foto, een ticketpagina, een folder, de stem aan de telefoon. En soms komt het antwoord van iemand anders, want ervaringen reizen van mens tot mens. In hechte gemeenschappen, zoals die van dove mensen, gaat dat snel.',
          'Een ja is pas het begin. Daarna komt de bestelling, de deur, de zaal en de weg naar huis, en overal onderweg is een van jullie aan het werk. Als dat op elkaar aansluit, merkt je bezoeker niets bijzonders. Precies dat is het doel: een bezoek dat gewoon klopt.',
          'Cultuur is natuurlijk niet altijd ergens anders. Een boek, een podcast, een film thuis, een workshop in de wijk: ook dat is cultuur, en voor wie de deur moeilijk uit kan soms de enige manier om mee te doen. Lees bij bezoeker daarom gerust ook lezer, kijker of deelnemer.',
        ],
      },
      // secties[1] is bewust leeg (placeholder om structuur van Module 1 aan te houden)
      null,
      {
        titel: 'Twee routes: achteraf of vanaf het begin',
        alineas: [
          'Er zijn twee routes, net als bij het maken zelf. Je kunt <strong>achteraf toegankelijk maken</strong> wat er al is: alt-teksten bij berichten die online staan, ondertitels onder een film die af is, een rolstoelplaats of een tijdslot dat je regelt als iemand belt.',
          'Of je neemt het <strong>vanaf het begin</strong> mee. Dan wordt het onderdeel van het werk zelf. Ondertiteling die je bij het idee al bedenkt, kun je vormgeven: kleur, plek en timing worden deel van de film. Een rolstoelplaats die vanaf de zaalindeling meedoet, is gewoon een plaats in je systeem. En vertel je bij elke activiteit standaard wat er te verwachten valt, dan hoeft niemand daar apart naar te vragen.',
          'Achteraf of vanaf het begin: de meeste organisaties doen allebei. En niemand hoeft het alleen te bedenken. Alt-teksten, audiodescriptie, een ondertitel: voor de makers en kunstenaars in je organisatie of netwerk is dat materiaal. Kunstenaar Christine Sun Kim, het voorbeeld in Module 1, maakt er zelfs kunst van, met ondertitels zo groot dat niemand eromheen kan. Vraag ze dus af en toe mee te denken, en er ontstaat iets wat niemand vooraf had bedacht.',
        ],
      },
    ],

    disciplineUitklap: {
      titel: 'Wat is jouw rol?',
      subtitel: 'Klik op je rol voor het stuk dat het meest bij jouw werk past. Alle blokken blijven bereikbaar, dus lees ze allemaal als je dat wilt.',
      items: [
        {
          titel: 'Ik werk aan marketing, content of social media',
          tekst: `<p style="margin:0 0 1rem">Kan iemand op je website vinden of een bezoek gaat lukken? Jij bepaalt het antwoord. Welke woorden kies je bij een voorstelling, een tentoonstelling, een boek of een festival? Wat zet je erbij, welke foto gaat mee, en wat vertel je over de praktische kant? Voor een deel van je publiek is jouw tekst het bezoek vóór het bezoek. Daarop valt het besluit om te komen.</p>
          <p style="margin:0 0 1rem">Help bij dat besluit door op twee plekken te vertellen wat bezoekers willen weten. <strong>Eén webpagina met alles bij elkaar:</strong> route, parkeren, ingang, toiletten, en wie ze kunnen bereiken. En <strong>bij elke activiteit</strong> wat er die dag of avond geldt: duur, pauze, drukte, geluid, ondertiteling. Niet iedereen begint online, dus zorg dat hetzelfde verhaal in je folder staat en aan de telefoon te horen is. Nieuw publiek vind je via de eigen kanalen van dove, blinde en andere gemeenschappen: verenigingen, nieuwsbrieven en groepen, en die geven graag door wat toegankelijk is.</p>
          <p style="margin:0 0 1rem">Wees daarbij <strong>precies</strong>, want details bepalen of iemand kan besluiten. Voor de een is dat de breedte van de lift, voor de ander of de audiotour of de audiodescriptie is ingesproken door de kunstenaar of door een computerstem, of er een schrijftolk is of automatische ondertiteling. Schrijf op wat er is. En wees eerlijk over wat er niet is. Schrijf het in duidelijke taal, met B1 als richtpunt. Dat is fijn voor mensen met een verstandelijke beperking, en net zo goed voor wie moe is, gehaast, of Nederlands nog leert.</p>
          <p style="margin:0 0 1rem">Je maakt dit werk zelden alleen. Vormgevers, fotografen, videografen en webbouwers bepalen mee hoe toegankelijk het resultaat wordt. Dus neem je doelen mee in het gesprek en in de opdracht: contrast, alt-teksten, labels bij invulvelden. Voor websites bestaat een vaste norm, en je kunt afspreken dat een bureau bij oplevering aantoont dat de site eraan voldoet.</p>
          <p style="margin:0"><strong>Wat het oplevert:</strong> bezoekers die voor het eerst komen omdat ze eindelijk wisten dat het kon, en content die voor iedereen duidelijker is, ook voor wie geen beperking heeft. De tool uit het voorbeeld hierboven geeft je een eerste versie van die ene pagina.</p>`,
        },
        {
          titel: 'Ik werk bij de ticketverkoop of aan de kassa',
          tekst: `<p style="margin:0 0 1rem">Kan iemand zelf een kaartje kopen dat past? Of een plek in de workshop, of een abonnement? Jij bepaalt het antwoord. Welke plaatsen en tijdsloten staan er te koop? Wat staat er bij de bestelknop? En kan iemand zelf kiezen wat past, of eerst bellen? Voor een deel van je publiek beslist jouw bestelpagina of het bezoek doorgaat.</p>
          <p style="margin:0 0 1rem">De meeste organisaties hebben al iets geregeld: een rolstoelplaats buiten de webshop om, de prikkelarme voorstelling apart in de agenda, een tweede kaartje voor wie meekomt per mail, met "bel of mail ons voor de mogelijkheden" erbij. Bij sommige organisaties, zoals TivoliVredenburg, koop je een rolstoelplaats gewoon via de webshop, net als elke andere plaats. Zo simpel kan het zijn.</p>
          <p style="margin:0 0 1rem"><strong>Begin met wat vandaag kan.</strong> Staat er bij de bestelknop nog niets over toegankelijkheid? Zet er dan één zin bij, bijvoorbeeld: "Rolstoelplaats, plek voor je begeleider of hulp bij het bestellen? Mail kassa@... of bel ...". Met een e-mailadres dus, en niet alleen een telefoonnummer. En weet dat bellen ook voor dove en slechthorende mensen kan: via Tolkcontact Teletolk bellen ze met een gebarentolk of via tekst, en bij jou gaat gewoon de telefoon. Staat die zin er al? Vraag dan bij elke aanvraag of je mag vastleggen wat iemand nodig heeft, zoals een rolstoelplaats, een plek aan het gangpad of een stoel vooraan, zodat het bij de volgende bestelling klaarstaat. Voor de langere termijn zit de grootste winst in je ticketsysteem, en dat koop je in. Zet toegankelijkheid in je eisen bij een nieuw pakket of een update, en vraag je leverancier hoe die dat aantoont.</p>
          <p style="margin:0 0 1rem">Wat er in die eisen moet, weten je bezoekers zelf het best. <strong>Zelf je plaats kiezen</strong> bijvoorbeeld: vaak ideaal, als de plattegrond ook zonder zicht te gebruiken is voor iemand die juist vooraan wil zitten. En laat ook iemand in een rolstoel kiezen: die ene plek vooraan, of liever naast vrienden. En <strong>flexibiliteit:</strong> wie een energiebeperking of een psychische beperking heeft, weet vaak pas op de dag zelf of het gaat lukken. Last minute bestellen en zonder gedoe annuleren maken dan het verschil. Dus vraag het je publiek, voordat je iets vastlegt.</p>
          <p style="margin:0"><strong>Wat het oplevert:</strong> kaartjes die verkocht worden in plaats van aangevraagd, minder mails en telefoontjes over hetzelfde, en bezoekers die op de dag zelf nog kunnen beslissen.</p>`,
        },
        {
          titel: 'Ik werk aan de balie, in de zaal of als vrijwilliger',
          tekst: `<p style="margin:0 0 1rem">Klopt bij het bezoek wat vooraf is beloofd? Jij bepaalt het antwoord. Bij de deur, in de garderobe, aan de bar, in de zaal, in de tentoonstelling of op het festivalterrein. Waar is de lift, en doet de ringleiding het? Wat is er met de bezoeker van vanavond afgesproken? En hoe vraag je of iemand iets nodig heeft? Voor een deel van je publiek bepaalt de eerste minuut binnen hoe de rest van het bezoek voelt.</p>
          <p style="margin:0 0 1rem">De meeste beperkingen merk je aan de deur niet. Autisme, een energiebeperking, angst, dementie: een bezoeker die daarmee binnenkomt, moet het ofwel uitleggen, ofwel hopen dat het goed gaat. Steeds meer podia en musea, van Paradiso en DeLaMar tot de Boerderij in Zoetermeer, doen daar iets aan met de <strong>Hidden Disabilities Sunflower</strong>. Een keycord met zonnebloemen, die de bezoeker zelf draagt en die tegen jou zegt "ik heb misschien wat meer tijd of hulp nodig". Meer niet. De bezoeker hoeft niets uit te leggen, en jij hoeft niet te raden.</p>
          <p style="margin:0 0 1rem">Raden is namelijk de valkuil. "Zal ik u even duwen?", of praten tegen degene die meekomt in plaats van tegen de bezoeker zelf. Wat werkt, is de vraag die je toch al stelt: <em>"Wat heeft u nodig voor een fijn bezoek?"</em> Dezelfde vraag als aan iedereen, en het antwoord is aan de bezoeker. "Ik heb niks nodig" is natuurlijk ook oké.</p>
          <p style="margin:0 0 1rem"><strong>Begin met wat vandaag kan.</strong> Zet wat er is en wat er is afgesproken in één overzicht bij de inwerkuitleg, zodat ook een vrijwilliger of invaller die drie avonden per jaar werkt het weet. Voor de langere termijn: vraag bezoekers hoe het ging, want wie een drempel tegenkomt meldt dat zelden uit zichzelf. Geef het door aan de collega's die de teksten en de systemen maken. Jij weet als eerste wat er niet klopt, en zij kunnen het veranderen.</p>
          <p style="margin:0"><strong>Wat het oplevert:</strong> bezoekers die zich welkom voelen en terugkomen, minder onhandige momenten aan de deur, en collega's die het van jou horen in plaats van uit een boze mail.</p>`,
        },
      ],
      afsluiter: 'De reis van je bezoeker gaat langs jullie alle drie. Lees dus ook eens wat er voor je collega\'s staat, want daar merk je waar jouw werk overgaat in dat van een ander.',
    },

    voorbeeld: {
      titel: 'Een voorbeeld dat de norm verlegt: één taal over toegankelijkheid',
      alineas: [
        'Een aantal Amsterdamse musea had de tentoonstellingen en het gebouw al een stuk toegankelijker gemaakt. Alleen kwam een bezoeker daar vooraf moeilijk achter, want elk museum beschreef het anders en op een andere plek. In 2024 kwamen ze met een oplossing: marketingorganisatie amsterdam&partners, Stichting Accessibility en ervaringsdeskundigen ontwikkelden samen één vaste set symbolen, die op elke museumpagina vertelt wat er is. En net zo belangrijk: wat er niet is.',
        'Inmiddels is deze set beschikbaar voor de hele Nederlandse recreatiebranche. Op <strong>communicerenovertoegankelijkheid.nl</strong> vul je gratis in wat jouw locatie biedt voor mensen die minder mobiel zijn, blind of slechtziend, doof of slechthorend, of prikkelgevoelig. Je krijgt er kant-en-klare tekst voor terug.',
        'Zo\'n lijst invullen levert nog iets op. Je merkt meteen wat er in jouw gebouw ontbreekt: geen ringleiding, geen rustige plek, een toilet dat te krap is voor een rolstoel. Wie de communicatie maakt, weet dat dan vaak eerder dan de rest van de organisatie, en kan het op de agenda zetten van wie erover gaat.',
      ],
    },

    kostenSectie: {
      titel: 'Wat het kost, en waar het vandaan komt',
      intro: 'Goed nieuws voor wie budget moet vragen: het meeste uit deze module is te betalen uit wat er al is. De kosten zitten in vier dingen.',
      kosten: [
        { titel: 'Tijd van je eigen mensen', tekst: 'De grootste post, in salaris of op de factuur van een zzp\'er. Uitzoeken wat er is, opschrijven, bijhouden en doorgeven aan iedereen die bezoekers ontvangt. En nieuw publiek bereiken, zoals dove of blinde bezoekers: contact opbouwen met hun organisaties en gemeenschappen is werk van maanden, en hoort daarom in je marketingplan en niet in één campagne.' },
        { titel: 'Mensen van buiten', tekst: 'Ervaringsdeskundigen die je betaalt voor advies en tests, een trainer voor je team, iemand die ondertitelt of alt-teksten schrijft.' },
        { titel: 'Techniek', tekst: 'Een toegankelijke website en een ticketsysteem waarin een rolstoelplaats gewoon te koop staat, zijn inmiddels de standaard. Zet het in je eisen bij een nieuw pakket of een vernieuwing, dan kost het niets extra. Een bestaande website achteraf laten aanpassen kost wel geld.' },
        { titel: 'Keuzes die geld kosten', tekst: 'Een gratis tweede kaartje voor wie meekomt is beleid, en rolstoelplaatsen vragen ruimte in de zaal. Zet er eerlijk naast wat je nu misloopt: wie niet kan bestellen, koopt niets.' },
      ],
      waarVandaan: [], // leeg — de tekst zit in de uitklapper hieronder
      waarVandaanUitklap: {
        titel: 'Waar komt het geld vandaan?',
        alineas: [
          'Meestal uit budgetten die er al zijn: marketing, onderhoud van de website, en personeel en opleiding. Voor websites en apps heeft Den Haag de <strong>Subsidieregeling Toegankelijke Stad</strong>, tot 25.000 euro, op voorwaarde dat ervaringsdeskundigen meewerken. Het budget voor 2026 is op, dus mik op 2027. En wie intern om budget vraagt, kan de wet noemen: sinds 2025 valt online kaartverkoop onder de <strong>Europese toegankelijkheidswet</strong>, met een uitzondering voor de kleinste organisaties, en de <strong>Wet gelijke behandeling</strong> geldt voor iedereen.',
        ],
      },
    },

    // Geen aparte diversiteitSectie voor deze module
    diversiteitSectie: null,

    // Hergebruikt de lessenSectie-structuur voor "Dit lukt alleen samen"
    lessenSectie: {
      titel: 'Dit lukt alleen samen',
      intro: 'Toegankelijk werken doe je op drie manieren samen:',
      punten: [
        {
          titel: 'Met je publiek',
          tekst: 'Of de plattegrond werkt, of de tekst klopt, of de ontvangst prettig was: dat weten mensen met een beperking zelf het best. Vraag het ze. Stel concrete vragen over concrete dingen, zoals een nieuwe ticketpagina of een plattegrond, en laat daarna weten wat je ermee hebt gedaan. Wissel af, zodat niet steeds dezelfde drie mensen al het werk doen. En betaal ze, want ervaringsdeskundigheid is expertise. Movisie maakte een beslisboom voor een passende vergoeding. Hoe verder je gaat, van raadplegen naar samen ontwerpen naar mede-eigenaarschap, hoe beter het resultaat.',
        },
        {
          titel: 'Met mensen die je nog niet kent',
          tekst: 'In Den Haag beoordeelt het testteam van Voorall, ervaringsdeskundigen uit de stad, je website of gebouw. Voor jou kosteloos, en met beperkte capaciteit: vraag het ruim van tevoren aan. Landelijk helpt het Loket van de Code Diversiteit & Inclusie je aan experts en ervaringsdeskundigen.',
        },
        {
          titel: 'Met je collega\'s',
          tekst: 'De reis van je bezoeker gaat langs jullie alle drie: wie de tekst maakt, wie het kaartje verkoopt en wie de deur opendoet. Lees gerust ook wat er hierboven voor je collega\'s staat, want daar merk je waar jouw werk overgaat in dat van een ander. Zet toegankelijkheid vast op de agenda van een overleg dat er al is, en spreek af wie het bijhoudt.',
        },
      ],
    },

    verderSectie: {
      titel: 'Van hier verder',
      intro: 'Je bent al begonnen, hier in de Boost. Drie manieren om door te gaan, van klein naar groot:',
      punten: [
        'Laat je website en je bestelproces testen door mensen die zelf een beperking hebben. In Den Haag kan dat via Voorall.',
        'Zet toegankelijkheid op de agenda van een overleg dat er al is, en in je marketingplan of je campagne, aan het begin en niet pas bij de evaluatie.',
        'Wil je het organisatiebreed aanpakken? Het stappenplan van de Code Diversiteit & Inclusie gaat langs programma, publiek, personeel en partners.',
      ],
    },

    denkVraag: 'Je kunt niet alles 100% toegankelijk maken voor 100% van de mensen. Keuzes maken mag, als je ze maar bewust maakt. Alleen: wie jouw informatie niet vindt, wie het kaartje niet kan kopen of wie zich aan de deur niet welkom voelt, laat dat zelden weten. Wat weten mensen van jullie, nog voordat ze binnen zijn? En wanneer heb je dat voor het laatst gevraagd aan iemand die het moest weten?',
  },

  reflectie: {
    intro: 'Kies iets recents uit jouw eigen werk: een webpagina, een post of een flyer, de ticketpagina of het bestelproces, of een dag waarop jij bezoekers ontving.',
    vragen: [
      {
        id: 'centraal',
        vraag: 'Voor wie is dit gemaakt?',
        toelichting: 'Denk aan taalniveau (B1 is een goed richtpunt, en op ishetb1.nl check je een woord), voorkennis en digitale vaardigheden, en aan wat iemand moet kunnen zien, horen of lezen om mee te doen. Van de twaalf diversiteitsfactoren van Movisie tellen hier vooral: beperking en chronische ziekte, leeftijd, taal en geletterdheid, en sociaaleconomische situatie.',
        placeholder: 'Beschrijf voor wie je dit hebt gemaakt...',
      },
      {
        id: 'afhaken',
        vraag: 'Wie kon hier niet aan meedoen, en waardoor?',
        toelichting: 'Noem minstens twee groepen, en zeg er telkens bij wat in jouw werk dat veroorzaakte. Denk aan de zes beperkingen uit de basiskennis. Twee manieren om erachter te komen: open je eigen bestelpagina en probeer als bezoeker een rolstoelplaats te kopen, of vraag vanavond één bezoeker of alles klopte wat vooraf was beloofd. Een antwoord ziet er bijvoorbeeld zo uit: "onze aankondiging stond alleen in een video zonder ondertitels", "een rolstoelplaats was alleen telefonisch te boeken" of "de stille ruimte stond nergens op de website", en niet: "deze bezoekers begrijpen het niet".',
        placeholder: 'Bijvoorbeeld: onze aankondiging stond alleen in een video zonder ondertitels...',
      },
      {
        id: 'aanpassing',
        vraag: 'Wat zou je veranderen om het toegankelijker en inclusiever te maken?',
        toelichting: 'Kies één verandering (of meerdere) die bij jouw werk past. Repareer je achteraf, of neem je het vanaf het begin mee?',
        placeholder: 'Beschrijf welke verandering je zou willen doorvoeren...',
        voorbeeldenBlok: {
          intro: 'Voorbeelden, van klein tot ingrijpend. Geen menu — wat jij bedenkt mag kleiner, groter of heel anders zijn.',
          groepen: [
            {
              titel: 'Achteraf toegankelijk maken',
              items: [
                'de gratis tool invullen en de tekst die je terugkrijgt op je website zetten',
                'één zin bij de bestelknop zetten over rolstoelplaats, begeleider en hulp bij bestellen, met een e-mailadres erbij',
                'één A4 voor iedereen die bezoekers ontvangt: waar de lift, de ringleiding en de rustige plek zijn, en wat er met bezoekers is afgesproken',
              ],
            },
            {
              titel: 'Vanaf het begin meenemen',
              items: [
                'toegankelijkheid als vaste vraag bij de start van elke campagne, tentoonstelling of festival',
                'rolstoelplaatsen en het tweede kaartje gewoon in de webshop, en omboeken tot de dag zelf',
                'meedoen met de Hidden Disabilities Sunflower, met een instructie voor iedereen aan de deur',
              ],
            },
          ],
        },
      },
    ],
  },

  actieOpdracht: {
    prefix: 'Bij onze volgende activiteit wil ik',
    placeholder: 'bijv: uitzoeken of omboeken tot de dag zelf kan in ons ticketsysteem',
    voorbeelden: [
      'de toegankelijkheidstekst voor onze locatie maken met de gratis tool, en op onze website zetten',
      'uitzoeken of omboeken tot de dag zelf kan in ons ticketsysteem',
      'elke avond één bezoeker vragen of alles klopte wat vooraf was beloofd',
    ],
  },

  bronnen: {
    intro: 'De basis onder deze module. Klik door voor verdieping, praktijkvoorbeelden en concrete regelingen.',
    groepen: [
      {
        titel: 'Waar deze tekst op is gebaseerd',
        items: [
          { titel: 'Hoe mensen met een beperking een cultuurbezoek ervaren, van oriëntatie tot thuiskomst', bron: 'Onbeperkt cultuur beleven, Significant APE in opdracht van OCW', url: 'https://catalogus.boekman.nl/pub/P20-0741A.pdf' },
          { titel: 'Drempels bij uitgaan, en informatie die niet te vinden of niet actueel is', bron: 'Lang niet toegankelijk, Sociaal en Cultureel Planbureau', url: 'https://www.scp.nl/publicaties/publicaties/2021/06/08/lang-niet-toegankelijk' },
          { titel: 'De twaalf diversiteitsfactoren', bron: 'Diversiteitsvlechtwerk, Movisie', url: 'https://www.movisie.nl/publicatie/diversiteitsvlechtwerk' },
          { titel: 'Eén gedeelde manier om over toegankelijkheid te schrijven', bron: 'Informatiestandaard Recreatiebranche, Stichting Accessibility', url: 'https://www.accessibility.nl/informatiestandaard-recreatiebranche' },
          { titel: 'Online kaartverkoop en de Europese toegankelijkheidswet', bron: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/themas/familie-zorg-en-gezondheid/leven-met-een-beperking/producten-en-diensten-toegankelijker-voor-mensen-met-beperking' },
          { titel: 'Aanpassingen die echt helpen', bron: 'Wet gelijke behandeling op grond van handicap of chronische ziekte', url: 'https://wetten.overheid.nl/BWBR0014915' },
          { titel: 'Een passende vergoeding voor ervaringsdeskundigen', bron: 'Gelijke waardering, passende vergoeding, Movisie', url: 'https://www.movisie.nl/publicatie/gelijke-waardering-passende-vergoeding-kracht-ervaringsdeskundigheid' },
          { titel: 'Het stappenplan langs programma, publiek, personeel en partners', bron: 'Code Diversiteit & Inclusie', url: 'https://codedi.nl/stappenplan' },
        ],
      },
      {
        titel: 'Mensen vinden en samenwerken',
        items: [
          { titel: 'Experts en ervaringsdeskundigen zoeken en benaderen', bron: 'het Loket van Code Diversiteit & Inclusie', url: 'https://codedi.nl/loket' },
          { titel: 'Je website of gebouw laten testen door ervaringsdeskundigen in Den Haag', bron: 'Voorall', url: 'https://voorall.nl/' },
        ],
      },
      {
        titel: 'Zo doen anderen het',
        items: [
          { titel: 'Een rolstoelticket gewoon in de webshop', bron: 'TivoliVredenburg', url: 'https://www.tivolivredenburg.nl/bezoek/toegankelijkheid/' },
          { titel: 'Een keycord die zegt: ik heb misschien wat meer tijd nodig', bron: 'Hidden Disabilities Sunflower', url: 'https://hdsunflower.com/nl/informatie-hidden-disabilities-sunflower' },
          { titel: 'Hoe Leiden de Sunflower invoerde, met kosten en training', bron: 'Praktijkvoorbeeld VNG', url: 'https://vng.nl/praktijkvoorbeelden/hidden-disability-sunflower' },
          { titel: 'Eén keer doorgeven wat je nodig hebt, zoals in het VK', bron: 'de Access Card', url: 'https://www.accesscard.online/how-it-works/' },
          { titel: 'Alt-tekst als schrijfvorm in plaats van een verplicht invulveld', bron: 'Alt-Text as Poetry, Bojana Coklyat en Shannon Finnegan', url: 'https://alt-text-as-poetry.net/' },
        ],
      },
      {
        titel: 'Praktische kennis, geld en regelingen',
        items: [
          { titel: 'De gratis tool die de toegankelijkheidstekst voor je website maakt', bron: 'Communiceren over toegankelijkheid', url: 'https://communicerenovertoegankelijkheid.nl/' },
          { titel: 'Toegankelijkheid vastleggen in een opdracht aan een bureau', bron: 'Factsheet inkoop digitale toegankelijkheid, PIANOo', url: 'https://www.pianoo.nl/nl/factsheet-inkoop-digitale-toegankelijkheid' },
          { titel: 'Toegankelijkheidsinformatie op je website en bij je programma', bron: 'Tips van Rotterdam Festivals', url: 'https://www.rotterdamfestivals.nl/toegankelijke-festivals/tips-informatieve-toegankelijkheid/' },
          { titel: 'Inclusief taalgebruik in al je communicatie', bron: 'Waarden voor een nieuwe taal, Code D&I', url: 'https://codedi.nl/handreiking-waarden-voor-een-nieuwe-taal' },
          { titel: 'Vijf tips voor een toegankelijke website', bron: 'DEN', url: 'https://www.den.nl/kennis-en-inspiratie/5-tips-voor-een-toegankelijke-website' },
          { titel: 'Social media toegankelijk maken', bron: 'DEN', url: 'https://den.nl/kennis-en-inspiratie/social-media-toegankelijk-maken-voor-iedereen-zo-doe-je-dat' },
          { titel: 'Zes tips voor toegankelijke cultuurmarketing', bron: 'Cultuurmarketing', url: 'https://cultuurmarketing.nl/6-tips-om-je-toegankelijkheid-te-vergroten/' },
          { titel: 'Checken of een woord op B1-niveau is', bron: 'Ishetb1.nl', url: 'https://ishetb1.nl/' },
          { titel: 'Bellen in gebarentaal of via tekst, en hoe je als organisatie bereikbaar wordt', bron: 'Tolkcontact Teletolk', url: 'https://www.tolkcontact.nl/tolkcontact-app/kpnteletolk/' },
          { titel: 'Subsidie voor digitale toegankelijkheid in Den Haag', bron: 'Subsidieregeling Toegankelijke Stad, Gemeente Den Haag', url: 'https://www.denhaag.nl/nl/subsidies/subsidie-toegankelijke-stad-aanvragen/' },
        ],
      },
    ],
  },
}