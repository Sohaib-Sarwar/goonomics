/**
 * Every external claim on the site points at one of these. Dates are the edition/update date
 * shown by the source when we checked it (2026-10-25).
 */
export interface Source {
  id: SourceId
  /** Inline citation label. */
  short: string
  title: string
  publisher: string
  date: string
  url: string
}

export type SourceId =
  | 'who2021'
  | 'campbell2021'
  | 'mftTable'
  | 'mayorga2015'
  | 'frappier2013'
  | 'compendium2024'
  | 'compendiumSex'
  | 'cleveland2022'
  | 'issm2022'
  | 'goAskAlice2025'
  | 'brysbaert2019'

export const SOURCES: Record<SourceId, Source> = {
  who2021: {
    id: 'who2021',
    short: 'WHO 2021',
    title: 'WHO laboratory manual for the examination and processing of human semen, 6th edition',
    publisher: 'World Health Organization',
    date: 'July 2021',
    url: 'https://www.who.int/publications/i/item/9789240030787',
  },
  campbell2021: {
    id: 'campbell2021',
    short: 'Campbell 2021',
    title:
      'Distribution of semen examination results 2020: a follow up of data collated for the WHO semen analysis manual 2010 (Campbell et al.)',
    publisher: 'Andrology 9:817–822',
    date: '2021',
    url: 'https://doi.org/10.1111/andr.12983',
  },
  mftTable: {
    id: 'mftTable',
    short: 'NHS MFT 2022',
    title: 'Lower reference limits and centile table for semen characteristics (reproduces WHO 2021 / Campbell et al.)',
    publisher: 'Manchester University NHS Foundation Trust, Andrology',
    date: 'V2, 28 Oct 2022',
    url: 'https://mft.nhs.uk/app/uploads/sites/4/2023/01/Lower-reference-limits-2021.pdf',
  },
  mayorga2015: {
    id: 'mayorga2015',
    short: 'Mayorga-Torres 2015',
    title: 'Influence of ejaculation frequency on seminal parameters (Mayorga-Torres et al., n = 6)',
    publisher: 'Reproductive Biology and Endocrinology 13:47',
    date: 'May 2015',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4445565/',
  },
  frappier2013: {
    id: 'frappier2013',
    short: 'Frappier 2013',
    title: 'Energy expenditure during sexual activity in young healthy couples (Frappier et al.)',
    publisher: 'PLoS ONE 8(10):e79342',
    date: 'Oct 2013',
    url: 'https://doi.org/10.1371/journal.pone.0079342',
  },
  compendium2024: {
    id: 'compendium2024',
    short: 'Compendium 2024',
    title: '2024 Adult Compendium of Physical Activities (Herrmann et al.)',
    publisher: 'Journal of Sport and Health Science',
    date: 'Jan 2024',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38242596/',
  },
  compendiumSex: {
    id: 'compendiumSex',
    short: 'Compendium',
    title: 'Compendium of Physical Activities: sexual activity codes (no solo-activity entry)',
    publisher: 'pacompendium.com',
    date: 'checked Oct 2026',
    url: 'https://pacompendium.com/sexual-activity/',
  },
  cleveland2022: {
    id: 'cleveland2022',
    short: 'Cleveland Clinic',
    title: 'Masturbation: what it is, benefits, myths and side effects',
    publisher: 'Cleveland Clinic',
    date: 'updated 25 Oct 2022',
    url: 'https://my.clevelandclinic.org/health/articles/24332-masturbation',
  },
  issm2022: {
    id: 'issm2022',
    short: 'ISSM 2022',
    title: 'What are the myths and facts about masturbation?',
    publisher: 'International Society for Sexual Medicine',
    date: '11 May 2022',
    url: 'https://www.issm.info/sexual-health-qa/what-are-the-myths-and-facts-about-masturbation',
  },
  goAskAlice2025: {
    id: 'goAskAlice2025',
    short: 'Columbia 2025',
    title: 'Why does it take millions of sperm to fertilize an egg?',
    publisher: 'Go Ask Alice!, Columbia University',
    date: 'edited 19 Nov 2025',
    url: 'https://goaskalice.columbia.edu/answered-questions/why-does-it-take-millions-sperm-fertilize-egg/',
  },
  brysbaert2019: {
    id: 'brysbaert2019',
    short: 'Brysbaert 2019',
    title: 'How many words do we read per minute? A review and meta-analysis of reading rate (Brysbaert)',
    publisher: 'Journal of Memory and Language 109:104047',
    date: '2019',
    url: 'https://doi.org/10.1016/j.jml.2019.104047',
  },
}
