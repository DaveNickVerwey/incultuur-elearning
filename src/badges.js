export const alleBadges = [
  {
    id: 'welkom',
    naam: 'Welkom!',
    icoon: '🚪',
    omschrijving: 'Je hebt je voor het eerst aangemeld.',
  },
  {
    id: 'eerste_stap',
    naam: 'Eerste stap',
    icoon: '✅',
    omschrijving: 'Je hebt module 1 afgerond.',
  },
  {
    id: 'op_stoom',
    naam: 'Op stoom',
    icoon: '🔥',
    omschrijving: 'Je hebt 2 modules afgerond.',
  },
  {
    id: 'diepgang',
    naam: 'Diepgang',
    icoon: '📖',
    omschrijving: 'Je hebt dezelfde module 3 keer geopend.',
  },
  {
    id: 'inzichtelijk',
    naam: 'Inzichtelijk',
    icoon: '💡',
    omschrijving: 'Je hebt 8 of meer inzichten opgedaan.',
  },
 
  {
    id: 'perfectionist',
    naam: 'Perfectionist',
    icoon: '⭐',
    omschrijving: 'Je hebt alle quizvragen in één keer goed beantwoord.',
  },
  {
    id: 'volleerd',
    naam: 'Volleerd',
    icoon: '🏆',
    omschrijving: 'Je hebt alle 4 modules afgerond.',
  },
  {
    id: 'reflectief',
    naam: 'Reflectief',
    icoon: '💬',
    omschrijving: 'Je hebt een reflectietekstvak ingevuld.',
  },
]

export const checkBadges = (data) => {
  const behaald = { ...(data.badges || {}) }
  const voortgang = data.voortgang || {}
  const moduleTeller = data.moduleTeller || {}
  const inzichten = data.inzichten || 0

  if (!behaald.welkom) behaald.welkom = true
  if (!behaald.eerste_stap && voortgang[1]) behaald.eerste_stap = true
  if (!behaald.op_stoom && Object.values(voortgang).filter(Boolean).length >= 2) behaald.op_stoom = true
  if (!behaald.volleerd && Object.values(voortgang).filter(Boolean).length >= 4) behaald.volleerd = true
  if (!behaald.inzichtelijk && inzichten >= 8) behaald.inzichtelijk = true
  if (!behaald.diepgang && Object.values(moduleTeller).some((v) => v >= 3)) behaald.diepgang = true
  if (!behaald.perfectionist && data.perfectScore) behaald.perfectionist = true
  if (!behaald.reflectief && data.reflectieIngevuld) behaald.reflectief = true

  return behaald
}