// modulesData.js
import { module1 } from './module1'
import { module2 } from './module2'

export const modulesData = [
  module1,
  module2,
  // Modules 3 en 4 zijn nog placeholders
  {
    nr: 3,
    titel: 'Makers van samenwerking',
    subtitel: 'Inclusieve teams en organisaties',
    doelgroep: 'Voor HR, leidinggevenden en coördinatoren',
    duur: '20-25 min',
    intro: null,
    reflectie: { vragen: [] },
    actieOpdracht: { prefix: '', voorbeelden: [] },
  },
  {
    nr: 4,
    titel: 'Makers van mogelijkheden',
    subtitel: 'Toegankelijkheid in de praktijk',
    doelgroep: 'Voor productie, techniek, facilitair en organisatie',
    duur: '20-25 min',
    intro: null,
    reflectie: { vragen: [] },
    actieOpdracht: { prefix: '', voorbeelden: [] },
  },
]