import visaData, { convertToUSD, getCountryById } from '../data/visaData';

// Per-country enrichment data (descriptions + official sources)
const countryEnrichment = {
  'portugal-d8': {
    description: 'One of Europe\'s most popular digital nomad destinations with a warm climate, affordable living, and a welcoming expat community.',
    longDescription: 'Portugal\'s D8 Digital Nomad Visa was launched in 2022 and quickly became one of the most sought-after programs in Europe. Lisbon, Porto, and the Algarve are top destinations for remote workers. The Non-Habitual Resident (NHR) tax regime offers significant tax advantages for new residents, and the country\'s safety, cuisine, and culture make it a dream for digital nomads looking to settle in the EU.',
    sources: [
      { name: 'AIMA – Portuguese Immigration Authority', url: 'https://www.sef.pt', type: 'Official Government Portal' },
      { name: 'Portugal Residence Visa Info', url: 'https://vistos.mne.gov.pt', type: 'Visa Application Portal' },
      { name: 'Non-Habitual Resident (NHR) Regime', url: 'https://info.portaldasfinancas.gov.pt', type: 'Tax Authority' },
    ]
  },
  'spain-dnv': {
    description: 'Spain\'s Digital Nomad Visa (Ley de Startups) offers a reduced 15% flat tax rate and access to one of Europe\'s most vibrant cultures.',
    longDescription: 'Introduced under Spain\'s Startup Law in 2023, the Digital Nomad Visa allows remote workers and freelancers to live and work in Spain. Barcelona, Madrid, Valencia, and Seville are popular bases. The generous Beckham Law tax benefits allow nomads to pay a flat 15% tax rate for up to 4 years — a huge draw for high earners relocating from non-EU countries.',
    sources: [
      { name: 'Ministerio de Asuntos Exteriores', url: 'https://www.exteriores.gob.es', type: 'Official Government Portal' },
      { name: 'Spain Startup Law (Ley de Startups)', url: 'https://www.boe.es', type: 'Legislation Reference' },
      { name: 'Agencia Tributaria – Tax Benefits', url: 'https://www.agenciatributaria.es', type: 'Tax Authority' },
    ]
  },
  'estonia-dnv': {
    description: 'The world\'s first digital nomad visa from Europe\'s most digitally advanced nation. Fast, straightforward, and integrated with e-Residency.',
    longDescription: 'Estonia pioneered the digital nomad visa concept, launching its program in 2020. The country\'s e-Residency program and digital-first government make it a haven for entrepreneurs and tech workers. Tallinn\'s medieval old town combined with a cutting-edge startup ecosystem creates a unique environment. While not renewable, it\'s the easiest EU entry point for short-term remote workers.',
    sources: [
      { name: 'Estonian Police and Border Guard Board', url: 'https://www.politsei.ee', type: 'Official Visa Authority' },
      { name: 'Estonia e-Residency Program', url: 'https://www.e-resident.gov.ee', type: 'Digital Residency Portal' },
      { name: 'Work in Estonia', url: 'https://www.workinestonia.com', type: 'Immigration Guide' },
    ]
  },
  'croatia-dnv': {
    description: 'Live on the stunning Adriatic coast with no tax on foreign income. Croatia\'s nomad permit is among the easiest in Europe to obtain.',
    longDescription: 'Croatia launched its Digital Nomad residence permit in 2021, targeting location-independent workers who want to experience the Dalmatian coast, vibrant cities like Zagreb and Split, and a relaxed Mediterranean lifestyle. Foreign income is exempt from Croatian tax during the permit period, making it especially attractive for US and non-EU nomads. Croatia joined the Schengen zone in January 2023.',
    sources: [
      { name: 'MUP – Croatian Ministry of Interior', url: 'https://mup.gov.hr', type: 'Official Government Portal' },
      { name: 'Croatia Digital Nomad Visa Guide', url: 'https://croatiaweek.com', type: 'Community Resource' },
      { name: 'Croatian Tax Administration', url: 'https://www.porezna-uprava.hr', type: 'Tax Authority' },
    ]
  },
  'germany-freelance': {
    description: 'Germany\'s Freelance (Freiberufler) visa is ideal for creatives, consultants, and professionals who want access to Europe\'s largest economy.',
    longDescription: 'Germany\'s Freelance Visa isn\'t a traditional digital nomad visa — it requires you to demonstrate genuine freelance work in a recognized liberal profession (e.g., journalist, artist, designer, IT consultant). The process is rigorous, involving proof of clients, a business plan, and sometimes a German language requirement depending on the state. However, the reward is unparalleled: EU access, strong infrastructure, and a clear path to permanent residency.',
    sources: [
      { name: 'Federal Foreign Office – Germany', url: 'https://www.auswaertiges-amt.de', type: 'Official Visa Portal' },
      { name: 'Make it in Germany', url: 'https://www.make-it-in-germany.com', type: 'Government Immigration Guide' },
      { name: 'Berlin Ausländerbehörde', url: 'https://www.berlin.de/labo', type: 'Local Residency Authority' },
    ]
  },
  'italy-dnv': {
    description: 'Italy\'s Digital Nomad Visa lets you live la dolce vita while working remotely — with access to art, cuisine, and Mediterranean beauty.',
    longDescription: 'Italy officially launched its Digital Nomad Visa in April 2024 under the "Decreto Flussi" framework. Applicants must prove remote employment with a non-Italian company and show a minimum income of €28,000/year. The visa allows stays of up to one year. Rome, Milan, Florence, and dozens of smaller towns have active nomad communities. The Italian "flat tax" regime can also benefit higher earners relocating here.',
    sources: [
      { name: 'Ministero degli Affari Esteri', url: 'https://vistoperitalia.esteri.it', type: 'Official Visa Portal' },
      { name: 'Sportello Unico Immigrazione', url: 'https://www.sportellounicoperlimmigrazio.it', type: 'Immigration Authority' },
      { name: 'Agenzia delle Entrate – Flat Tax', url: 'https://www.agenziaentrate.gov.it', type: 'Tax Authority' },
    ]
  },
  'greece-dnv': {
    description: 'Enjoy 50% income tax reduction for 7 years while living on Greek islands or vibrant cities like Athens and Thessaloniki.',
    longDescription: 'Greece\'s Digital Nomad Visa launched in 2021 and comes with a remarkable incentive: a 50% income tax reduction for the first 7 years of residency. Greece is one of the few countries where the tax benefit is this significant for incoming nomads. With stunning islands, ancient history, low cost of living, and access to the Schengen zone, Greece offers a compelling package for nomads who qualify.',
    sources: [
      { name: 'Greek Ministry of Digital Governance', url: 'https://mindigital.gr', type: 'Official Government Portal' },
      { name: 'Enterprise Greece', url: 'https://www.enterprisegreece.gov.gr', type: 'Investment & Residency Guide' },
      { name: 'AADE – Greek Tax Authority', url: 'https://www.aade.gr', type: 'Tax Authority' },
    ]
  },
  'czech-long-term': {
    description: 'A budget-friendly Central European base with a rich cultural scene, excellent beer, and affordable long-term business visa options.',
    longDescription: 'Czech Republic does not have a dedicated digital nomad visa, but the Long-Term Visa for Business ("Živnostenský list") is widely used by freelancers. This requires obtaining a Czech trade license and meeting financial sufficiency requirements. Prague is consistently ranked among the best cities in Europe for expats and offers a thriving startup scene, affordable rents compared to western Europe, and Schengen access.',
    sources: [
      { name: 'Czech Ministry of Interior', url: 'https://www.mvcr.cz', type: 'Official Visa Authority' },
      { name: 'Czech Trade Authority (MPO)', url: 'https://www.mpo.cz', type: 'Business Licensing Portal' },
      { name: 'Czech Points – Government Services', url: 'https://www.czechpoint.cz', type: 'Government Services' },
    ]
  },
  'mexico-temporary': {
    description: 'Close to the US, with a booming nomad scene in CDMX, Playa del Carmen, and Oaxaca — and one of the cheapest visas on the list.',
    longDescription: 'Mexico\'s Temporary Resident Visa is not marketed as a digital nomad visa but is widely used as one. It\'s easy to obtain, cheap ($48 USD), and allows you to stay 1–4 years. Mexico City\'s Colonia Roma and Condesa neighborhoods are legendary nomad hubs, while the Caribbean coast offers beaches and co-working spaces. The peso exchange rate is favorable for USD/EUR earners.',
    sources: [
      { name: 'Instituto Nacional de Migración', url: 'https://www.inm.gob.mx', type: 'Official Immigration Authority' },
      { name: 'Secretaría de Relaciones Exteriores', url: 'https://www.gob.mx/sre', type: 'Foreign Affairs Ministry' },
      { name: 'SAT – Mexican Tax Authority', url: 'https://www.sat.gob.mx', type: 'Tax Authority' },
    ]
  },
  'dubai-virtual': {
    description: 'Tax-free income, ultra-fast processing, and world-class infrastructure in one of the globe\'s most ambitious cities.',
    longDescription: 'Dubai\'s Virtual Working Program launched in 2021 allows remote workers to live in Dubai while working for an overseas employer or running their own business. There is zero income tax in the UAE, and Dubai boasts exceptional infrastructure, safety, and connectivity. The visa fee is on the higher end ($611 USD), and you must maintain health insurance valid in the UAE. Family members can be sponsored.',
    sources: [
      { name: 'Dubai Virtual Working Programme', url: 'https://www.visitdubai.com/en/live-and-work', type: 'Official Program Page' },
      { name: 'Federal Authority for Identity and Citizenship', url: 'https://icp.gov.ae', type: 'UAE Immigration Authority' },
      { name: 'DIFC – Dubai International Financial Centre', url: 'https://www.difc.ae', type: 'Business & Residency Hub' },
    ]
  },
  'thailand-smart': {
    description: 'A 4-year visa for tech and digital professionals in Thailand — with no work permit needed and fast-track immigration at airports.',
    longDescription: 'Thailand\'s SMART Visa targets highly skilled professionals in targeted industries including technology, digital, robotics, and biotech. Unlike Thailand\'s popular tourist visas, the SMART Visa grants a renewable 4-year stay with no work permit required for the holder. Bangkok, Chiang Mai, and Phuket are established digital nomad hubs. The high income requirement ($80,000/year) limits accessibility, but for qualifying professionals it\'s exceptional value.',
    sources: [
      { name: 'Thailand BOI – SMART Visa Program', url: 'https://smart-visa.boi.go.th', type: 'Official Program Portal' },
      { name: 'Thai Immigration Bureau', url: 'https://www.immigration.go.th', type: 'Official Immigration Authority' },
      { name: 'Revenue Department Thailand', url: 'https://www.rd.go.th', type: 'Tax Authority' },
    ]
  },
  'malta-dnv': {
    description: 'The only English-speaking EU island nation — Malta\'s Nomad Residence Permit offers Mediterranean sunshine with full EU connectivity.',
    longDescription: 'Malta\'s Nomad Residence Permit launched in 2021 and is one of the few in Europe with native English as an official language. The small island nation (316 km²) sits in the heart of the Mediterranean, with excellent flight connections to Europe and North Africa. Malta has a very low crime rate, excellent healthcare, and a growing community of remote workers. The permit is renewable up to 3 years.',
    sources: [
      { name: 'Residency Malta Agency', url: 'https://residencymalta.gov.mt', type: 'Official Residency Authority' },
      { name: 'Identity Malta – Visa Applications', url: 'https://identitymalta.com', type: 'Visa & Identity Services' },
      { name: 'Malta Enterprise – Business Support', url: 'https://www.maltaenterprise.com', type: 'Business & Investment Portal' },
    ]
  }
};

/**
 * LandChoice Mock API Service
 * Simulates a backend with filtering, searching, and comparison features.
 */
class ApiService {
  /**
   * Simulate a network delay
   */
  async sleep(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch countries with advanced filtering
   * Supports: income, duration, cost, qualityOfLife, processingTime
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Filtered countries
   */
  async fetchCountries(params = {}) {
    await this.sleep();

    const {
      income = Infinity,
      duration = 0,
      cost = 100,
      qol = 0,
      processing = 'Any',
      search = ''
    } = params;

    return visaData.filter(country => {
      // Basic Search
      const matchesSearch = country.country.toLowerCase().includes(search.toLowerCase()) || 
                           country.visaName.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // Income Filter (Convert to USD for unified comparison)
      const incomeUSD = convertToUSD(country.minIncomeMonthly, country.currency);
      if (incomeUSD > income) return false;

      // Duration Filter
      if (country.durationMonths < duration) return false;

      // Cost of Living Filter
      if (country.costOfLivingIndex > cost) return false;

      // Quality of Life Filter
      if (country.qualityOfLife < qol) return false;

      // Processing Time
      if (processing !== 'Any') {
        if (processing === 'Fastest' && country.processingWeeks > 4) return false;
        if (processing === 'Normal' && country.processingWeeks > 12) return false;
      }

      return true;
    });
  }

  /**
   * Get side-by-side comparison data
   * @param {Array<string>} ids - Country IDs
   * @returns {Promise<Object>} Comparison data and highlights
   */
  async fetchComparisonData(ids) {
    await this.sleep();

    const selected = ids.map(id => getCountryById(id)).filter(Boolean);
    
    if (selected.length === 0) return { error: 'No countries selected' };

    const countriesData = selected.map(country => ({
      ...country,
      minIncomeUSD: Math.round(convertToUSD(country.minIncomeMonthly, country.currency)),
      processingTime: `${country.processingWeeks} weeks`,
    }));

    return {
      countries: countriesData,
      winners: {
        cheapest: countriesData.reduce((p, c) => p.costOfLivingIndex < c.costOfLivingIndex ? p : c).id,
        fastest: countriesData.reduce((p, c) => p.processingWeeks < c.processingWeeks ? p : c).id,
        safest: countriesData.reduce((p, c) => p.safetyRating > c.safetyRating ? p : c).id,
        highestQoL: countriesData.reduce((p, c) => p.qualityOfLife > c.qualityOfLife ? p : c).id,
        lowestIncome: countriesData.reduce((p, c) => {
            const pIncome = convertToUSD(p.minIncomeMonthly, p.currency);
            const cIncome = convertToUSD(c.minIncomeMonthly, c.currency);
            return pIncome < cIncome ? p : c;
        }).id
      }
    };
  }

  /**
   * Get full details for a single country by ID
   * @param {string} id - Country visa ID
   * @returns {Promise<Object|null>} Enriched country data
   */
  async fetchCountryById(id) {
    await this.sleep(400);
    const country = getCountryById(id);
    if (!country) return null;

    const enrichment = countryEnrichment[id] || {
      description: `${country.country} offers a ${country.difficulty.toLowerCase()}-difficulty digital nomad visa option for remote workers.`,
      longDescription: `The ${country.visaName} is available for remote workers and digital professionals. Requirements include proof of income, health insurance, and valid passport. Processing takes approximately ${country.processingWeeks} weeks.`,
      sources: [
        { name: `${country.country} Immigration Authority`, url: '#', type: 'Official Government Portal' },
      ]
    };

    return { ...country, ...enrichment };
  }
}

export default new ApiService();
