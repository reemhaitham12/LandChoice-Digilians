// Comprehensive visa data for digital nomads and remote workers
export const visaData = [
  {
    id: 'portugal-d8',
    country: 'Portugal',
    countryCode: 'PT',
    visaName: 'D8 Digital Nomad Visa',
    visaType: 'Residence',
    difficulty: 'Medium',
    minIncomeMonthly: 3280,
    minIncomeYearly: 39360,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 24,
    renewableYears: 5,
    processingWeeks: 8,
    costUSD: 320,
    costOfLivingIndex: 62.5,
    color: '#3b82f6',
    coordinates: { lng: -8.2245, lat: 39.3999 },
    requirements: [
      'Valid passport (6+ months)',
      'Proof of remote work or freelance contract',
      'Proof of income (€3,280/month minimum)',
      'Health insurance coverage',
      'Clean criminal record',
      'Proof of accommodation',
      'Tax residency certificate (if applicable)'
    ],
    benefits: [
      'Access to EU Schengen zone',
      'Path to permanent residency',
      'Family reunification allowed',
      'No minimum stay requirements',
      'Favorable tax regime (NHR)'
    ],
    restrictions: [
      'Cannot work for Portuguese companies',
      'Must maintain minimum income',
      'Must file Portuguese taxes after becoming resident'
    ],
    popular: true,
    featured: true,
    safetyRating: 9.2,
    internetSpeed: 95,
    englishProficiency: 'Moderate',
    timezone: 'GMT+0',
    qualityOfLife: 9.1,
    bestFor: ['Remote workers', 'Freelancers', 'Digital entrepreneurs']
  },
  {
    id: 'spain-dnv',
    country: 'Spain',
    countryCode: 'ES',
    visaName: 'Digital Nomad Visa',
    visaType: 'Residence',
    difficulty: 'Medium',
    minIncomeMonthly: 2520,
    minIncomeYearly: 30240,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 5,
    processingWeeks: 12,
    costUSD: 410,
    costOfLivingIndex: 58.3,
    color: '#10b981',
    coordinates: { lng: -3.7492, lat: 40.4637 },
    requirements: [
      'Valid passport (6+ months)',
      'Employment contract or client contracts',
      'Proof of income (€2,520/month minimum)',
      'Comprehensive health insurance',
      'Clean criminal record certificate',
      'Proof of remote work for at least 1 year',
      'University degree or 3+ years professional experience'
    ],
    benefits: [
      'Schengen zone access',
      'Reduced income tax (15% for first 4 years)',
      'Family members can apply',
      'Path to permanent residency',
      'Work for Spanish companies up to 20% of income'
    ],
    restrictions: [
      'Cannot work full-time for Spanish companies',
      'Must maintain remote employment',
      'Minimum 90 days/year in Spain for renewal'
    ],
    popular: true,
    featured: true,
    safetyRating: 8.9,
    internetSpeed: 120,
    englishProficiency: 'Moderate',
    timezone: 'GMT+1',
    qualityOfLife: 8.8,
    bestFor: ['Tech professionals', 'Consultants', 'Content creators']
  },
  {
    id: 'estonia-dnv',
    country: 'Estonia',
    countryCode: 'EE',
    visaName: 'Digital Nomad Visa',
    visaType: 'Short-stay',
    difficulty: 'Easy',
    minIncomeMonthly: 3504,
    minIncomeYearly: 42048,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 0,
    processingWeeks: 4,
    costUSD: 100,
    costOfLivingIndex: 54.2,
    color: '#8b5cf6',
    coordinates: { lng: 25.0136, lat: 58.5953 },
    requirements: [
      'Valid passport',
      'Employment contract or business ownership proof',
      'Proof of income (€3,504/month minimum)',
      'Travel health insurance',
      'Location-independent work proof',
      'Cover letter explaining purpose'
    ],
    benefits: [
      'Fast processing (15-30 days)',
      'E-Residency integration',
      'Digital-first society',
      'Startup-friendly ecosystem',
      'No tax obligation for short stays'
    ],
    restrictions: [
      'Not renewable beyond 12 months',
      'Cannot work for Estonian companies',
      'Not a residence permit'
    ],
    popular: true,
    featured: false,
    safetyRating: 9.5,
    internetSpeed: 130,
    englishProficiency: 'High',
    timezone: 'GMT+2',
    qualityOfLife: 8.5,
    bestFor: ['Startup founders', 'Tech workers', 'Crypto entrepreneurs']
  },
  {
    id: 'croatia-dnv',
    country: 'Croatia',
    countryCode: 'HR',
    visaName: 'Digital Nomad Residence Permit',
    visaType: 'Temporary residence',
    difficulty: 'Easy',
    minIncomeMonthly: 2539,
    minIncomeYearly: 30468,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 0,
    processingWeeks: 6,
    costUSD: 85,
    costOfLivingIndex: 51.8,
    color: '#f43f5e',
    coordinates: { lng: 15.2, lat: 45.1 },
    requirements: [
      'Passport valid 3+ months beyond stay',
      'Proof of remote employment or ownership',
      'Monthly income proof (€2,539 minimum)',
      'Health insurance certificate',
      'Accommodation proof',
      'Clean criminal record',
      'Proof of sufficient funds'
    ],
    benefits: [
      'Affordable cost of living',
      'Schengen zone access (Croatia joined 2023)',
      'Beautiful Adriatic coast',
      'No tax on foreign income',
      'Simple application process'
    ],
    restrictions: [
      'Non-renewable',
      'Cannot work for Croatian companies',
      'Must leave after 12 months'
    ],
    popular: true,
    featured: false,
    safetyRating: 8.7,
    internetSpeed: 85,
    englishProficiency: 'Moderate',
    timezone: 'GMT+1',
    qualityOfLife: 8.2,
    bestFor: ['Budget travelers', 'Nature lovers', 'Content creators']
  },
  {
    id: 'germany-freelance',
    country: 'Germany',
    countryCode: 'DE',
    visaName: 'Freelance Visa (Freiberufler)',
    visaType: 'Residence',
    difficulty: 'Hard',
    minIncomeMonthly: 3500,
    minIncomeYearly: 42000,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 36,
    renewableYears: 999,
    processingWeeks: 16,
    costUSD: 150,
    costOfLivingIndex: 72.1,
    color: '#f59e0b',
    coordinates: { lng: 10.4515, lat: 51.1657 },
    requirements: [
      'Valid passport',
      'Portfolio of work and client contracts',
      'Business plan with financial projections',
      'Proof of professional qualifications',
      'Health insurance (public or private)',
      'Proof of sufficient funds',
      'Letter explaining economic benefit to Germany',
      'Proof of accommodation'
    ],
    benefits: [
      'Access to world-class infrastructure',
      'Strong economy and stable market',
      'Pathway to permanent residency (5 years)',
      'Family reunification rights',
      'EU access',
      'Excellent public services'
    ],
    restrictions: [
      'Complex application process',
      'Requires German bureaucracy navigation',
      'High cost of living',
      'Must maintain freelance status'
    ],
    popular: false,
    featured: false,
    safetyRating: 9.3,
    internetSpeed: 115,
    englishProficiency: 'High',
    timezone: 'GMT+1',
    qualityOfLife: 9.3,
    bestFor: ['Designers', 'Writers', 'Consultants', 'Artists']
  },
  {
    id: 'italy-dnv',
    country: 'Italy',
    countryCode: 'IT',
    visaName: 'Digital Nomad Visa',
    visaType: 'Residence',
    difficulty: 'Medium',
    minIncomeMonthly: 2300,
    minIncomeYearly: 27600,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 0,
    processingWeeks: 10,
    costUSD: 116,
    costOfLivingIndex: 66.4,
    color: '#06b6d4',
    coordinates: { lng: 12.5674, lat: 41.8719 },
    requirements: [
      'Valid passport (6+ months)',
      'Proof of remote work or freelance status',
      'Income proof (€2,300/month minimum)',
      'Health insurance',
      'Accommodation proof',
      'University degree or professional experience',
      'Criminal background check'
    ],
    benefits: [
      'Experience Italian culture and cuisine',
      'Schengen zone access',
      'Rich historical heritage',
      'Excellent quality of life',
      'Favorable climate'
    ],
    restrictions: [
      'Non-renewable',
      'Cannot work for Italian employers',
      'Complex bureaucracy'
    ],
    popular: true,
    featured: false,
    safetyRating: 8.5,
    internetSpeed: 75,
    englishProficiency: 'Low to Moderate',
    timezone: 'GMT+1',
    qualityOfLife: 8.4,
    bestFor: ['Culture enthusiasts', 'Food lovers', 'Creative professionals']
  },
  {
    id: 'greece-dnv',
    country: 'Greece',
    countryCode: 'GR',
    visaName: 'Digital Nomad Visa',
    visaType: 'Residence',
    difficulty: 'Easy',
    minIncomeMonthly: 3500,
    minIncomeYearly: 42000,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 2,
    processingWeeks: 8,
    costUSD: 150,
    costOfLivingIndex: 57.9,
    color: '#ec4899',
    coordinates: { lng: 21.8243, lat: 39.0742 },
    requirements: [
      'Valid passport',
      'Employment contract or business proof',
      'Monthly income proof (€3,500 minimum)',
      'Health insurance coverage',
      'Clean criminal record',
      'Lease agreement or property ownership',
      'Proof of professional activity'
    ],
    benefits: [
      'Renewable up to 2 years',
      '50% income tax reduction for first 7 years',
      'Island living opportunities',
      'Mediterranean climate',
      'Low cost of living',
      'Schengen access'
    ],
    restrictions: [
      'Cannot work for Greek companies',
      'Must file Greek tax returns',
      'Limited renewal options'
    ],
    popular: true,
    featured: true,
    safetyRating: 8.6,
    internetSpeed: 70,
    englishProficiency: 'Moderate',
    timezone: 'GMT+2',
    qualityOfLife: 8.1,
    bestFor: ['Island hoppers', 'History buffs', 'Wellness seekers']
  },
  {
    id: 'czech-long-term',
    country: 'Czech Republic',
    countryCode: 'CZ',
    visaName: 'Long-Term Visa for Business',
    visaType: 'Long-term visa',
    difficulty: 'Medium',
    minIncomeMonthly: 1500,
    minIncomeYearly: 18000,
    currency: 'CZK',
    currencySymbol: 'Kč',
    durationMonths: 12,
    renewableYears: 999,
    processingWeeks: 12,
    costUSD: 135,
    costOfLivingIndex: 50.2,
    color: '#14b8a6',
    coordinates: { lng: 14.4378, lat: 50.0755 },
    requirements: [
      'Valid passport',
      'Trade license or business plan',
      'Proof of accommodation',
      'Health insurance',
      'Proof of financial means',
      'Clean criminal record',
      'Apostilled documents'
    ],
    benefits: [
      'Very affordable cost of living',
      'Central European location',
      'Schengen zone access',
      'Rich cultural scene',
      'Excellent public transport'
    ],
    restrictions: [
      'Complex bureaucracy',
      'Language barrier (limited English)',
      'Must establish business presence'
    ],
    popular: false,
    featured: false,
    safetyRating: 9.0,
    internetSpeed: 90,
    englishProficiency: 'Moderate',
    timezone: 'GMT+1',
    qualityOfLife: 8.3,
    bestFor: ['Budget-conscious nomads', 'Eastern Europe enthusiasts']
  },
  {
    id: 'mexico-temporary',
    country: 'Mexico',
    countryCode: 'MX',
    visaName: 'Temporary Resident Visa',
    visaType: 'Residence',
    difficulty: 'Easy',
    minIncomeMonthly: 2700,
    minIncomeYearly: 32400,
    currency: 'USD',
    currencySymbol: '$',
    durationMonths: 12,
    renewableYears: 4,
    processingWeeks: 6,
    costUSD: 48,
    costOfLivingIndex: 43.8,
    color: '#16a34a',
    coordinates: { lng: -102.5528, lat: 23.6345 },
    requirements: [
      'Valid passport',
      'Proof of monthly income ($2,700 minimum)',
      'Bank statements (6 months)',
      'Application form',
      'Passport photos',
      'Visa application fee'
    ],
    benefits: [
      'Very affordable living costs',
      'Proximity to USA',
      'Excellent climate in many regions',
      'Vibrant expat community',
      'Renewable up to 4 years',
      'Rich culture and cuisine'
    ],
    restrictions: [
      'Must apply from home country or at border',
      'Renewal requires proof of ties to Mexico',
      'Limited to 4 years total'
    ],
    popular: true,
    featured: true,
    safetyRating: 7.2,
    internetSpeed: 65,
    englishProficiency: 'Low',
    timezone: 'GMT-6',
    qualityOfLife: 7.8,
    bestFor: ['US-based nomads', 'Spanish learners', 'Beach lovers']
  },
  {
    id: 'dubai-virtual',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    visaName: 'Dubai Virtual Working Program',
    visaType: 'Remote work permit',
    difficulty: 'Easy',
    minIncomeMonthly: 5000,
    minIncomeYearly: 60000,
    currency: 'USD',
    currencySymbol: '$',
    durationMonths: 12,
    renewableYears: 999,
    processingWeeks: 2,
    costUSD: 611,
    costOfLivingIndex: 68.7,
    color: '#a855f7',
    coordinates: { lng: 55.2708, lat: 25.2048 },
    requirements: [
      'Valid passport (6+ months)',
      'Proof of employment or business ownership',
      'Monthly income proof ($5,000 minimum)',
      'Health insurance coverage (UAE-valid)',
      'Passport copy and photo',
      'Online application'
    ],
    benefits: [
      'Tax-free income',
      'World-class infrastructure',
      'Fast processing (2-5 days)',
      'Renewable indefinitely',
      'Family sponsorship available',
      'Premium lifestyle amenities'
    ],
    restrictions: [
      'High cost of living',
      'Expensive visa fee',
      'Must maintain minimum income',
      'Cannot work for UAE companies without work permit'
    ],
    popular: true,
    featured: true,
    safetyRating: 9.7,
    internetSpeed: 180,
    englishProficiency: 'High',
    timezone: 'GMT+4',
    qualityOfLife: 9.5,
    bestFor: ['High earners', 'Luxury seekers', 'Tax optimizers']
  },
  {
    id: 'thailand-smart',
    country: 'Thailand',
    countryCode: 'TH',
    visaName: 'SMART Visa',
    visaType: 'Long-term visa',
    difficulty: 'Medium',
    minIncomeMonthly: 6670,
    minIncomeYearly: 80000,
    currency: 'USD',
    currencySymbol: '$',
    durationMonths: 48,
    renewableYears: 999,
    processingWeeks: 6,
    costUSD: 175,
    costOfLivingIndex: 44.3,
    color: '#eab308',
    coordinates: { lng: 100.5018, lat: 13.7563 },
    requirements: [
      'Valid passport',
      'Employment in targeted industries',
      'Income proof ($80,000/year minimum)',
      'Educational certificates',
      'Work contract or company documents',
      'Health certificate'
    ],
    benefits: [
      'Up to 4-year validity',
      'No work permit needed',
      'Multiple re-entry',
      'Family members eligible',
      'Fast-track immigration',
      'Low cost of living'
    ],
    restrictions: [
      'Limited to specific industries (tech, digital, automotive)',
      'High income requirement',
      'Must work for Thai or international company'
    ],
    popular: false,
    featured: false,
    safetyRating: 8.3,
    internetSpeed: 85,
    englishProficiency: 'Moderate',
    timezone: 'GMT+7',
    qualityOfLife: 7.5,
    bestFor: ['Tech professionals', 'Startup employees', 'Digital industry workers']
  },
  {
    id: 'malta-dnv',
    country: 'Malta',
    countryCode: 'MT',
    visaName: 'Nomad Residence Permit',
    visaType: 'Residence',
    difficulty: 'Easy',
    minIncomeMonthly: 3200,
    minIncomeYearly: 38400,
    currency: 'EUR',
    currencySymbol: '€',
    durationMonths: 12,
    renewableYears: 3,
    processingWeeks: 4,
    costUSD: 350,
    costOfLivingIndex: 68.1,
    color: '#0ea5e9',
    coordinates: { lng: 14.3754, lat: 35.8989 },
    requirements: [
      'Valid passport',
      'Remote work contract or business ownership',
      'Monthly income proof (€2,700 minimum)',
      'Health insurance',
      'Rental agreement',
      'Clean criminal record',
      'Application fee'
    ],
    benefits: [
      'English-speaking EU country',
      'Mediterranean island lifestyle',
      'Schengen zone access',
      'Renewable up to 3 years',
      'Excellent weather year-round',
      'Low crime rate'
    ],
    restrictions: [
      'Small island (can feel limiting)',
      'Higher cost of living',
      'Cannot work for Maltese companies'
    ],
    popular: true,
    featured: false,
    safetyRating: 9.1,
    internetSpeed: 100,
    englishProficiency: 'Native',
    timezone: 'GMT+1',
    qualityOfLife: 8.9,
    bestFor: ['English speakers', 'Island lovers', 'EU access seekers']
  }
];

// Helper functions for filtering and sorting
export const getCountriesByDifficulty = (difficulty) => {
  return visaData.filter(visa => visa.difficulty === difficulty);
};

export const getCountriesByMaxIncome = (maxIncome, currency = 'USD') => {
  return visaData.filter(visa => {
    const incomeInUSD = currency === 'USD' ? visa.minIncomeMonthly : convertToUSD(visa.minIncomeMonthly, visa.currency);
    return incomeInUSD <= maxIncome;
  });
};

export const getFeaturedCountries = () => {
  return visaData.filter(visa => visa.featured);
};

export const getPopularCountries = () => {
  return visaData.filter(visa => visa.popular);
};

export const getCountryById = (id) => {
  return visaData.find(visa => visa.id === id);
};

export const getCountryByName = (name) => {
  return visaData.find(visa => visa.country.toLowerCase() === name.toLowerCase());
};

// Simple currency conversion (should be updated with real-time rates)
export const convertToUSD = (amount, fromCurrency) => {
  const rates = {
    EUR: 1.08,
    GBP: 1.26,
    CZK: 0.042,
    USD: 1.0,
    AED: 0.27,
    THB: 0.029,
    MXN: 0.058
  };
  return amount * (rates[fromCurrency] || 1);
};

export default visaData;
