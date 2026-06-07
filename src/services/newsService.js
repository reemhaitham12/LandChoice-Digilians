import axios from 'axios';

/**
 * Service for fetching real-time news about visas, immigration, and digital nomad policies
 * Uses NewsAPI.org for news aggregation
 */
class NewsService {
  constructor() {
    this.baseURL = 'https://newsapi.org/v2';
    this.apiKey = import.meta.env.VITE_NEWSAPI_KEY || '';

    // Cache for API responses (30 minutes)
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  }

  /**
   * Get cached data or null if expired/not found
   */
  getCached(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache data
   */
  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Fetch visa and immigration news for a specific country
   * @param {string} country - Country name (e.g., 'Portugal', 'Spain')
   * @returns {Promise<Array>} Array of news articles
   */
  async getCountryNews(country) {
    const cacheKey = `news_${country}`;
    const cached = this.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      console.warn('VITE_NEWSAPI_KEY not configured. Using mock data.');
      return this.getMockNews(country);
    }

    try {
      const query = `"${country}" AND ("digital nomad" OR "remote work visa" OR "immigration" OR "visa policy" OR "residence permit")`;

      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: this.apiKey
        }
      });

      const articles = this.parseArticles(response.data.articles, country);
      this.setCached(cacheKey, articles);

      return articles;
    } catch (error) {
      console.error('Error fetching news:', error.message);
      return this.getMockNews(country);
    }
  }

  /**
   * Fetch general digital nomad and visa news
   * @returns {Promise<Array>} Array of news articles
   */
  async getGeneralNews() {
    const cacheKey = 'news_general';
    const cached = this.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      console.warn('VITE_NEWSAPI_KEY not configured. Using mock data.');
      return this.getMockGeneralNews();
    }

    try {
      const query = '"digital nomad visa" OR "remote work visa" OR "digital nomad" OR "immigration policy" OR "residence permit"';

      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: this.apiKey
        }
      });

      const articles = this.parseArticles(response.data.articles, 'general');
      this.setCached(cacheKey, articles);

      return articles;
    } catch (error) {
      console.error('Error fetching general news:', error.message);
      return this.getMockGeneralNews();
    }
  }

  /**
   * Parse and format articles
   */
  parseArticles(articles, country) {
    return articles
      .filter(article => article.title && article.description)
      .map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source?.name || 'Unknown',
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage,
        country: country,
        date: new Date(article.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
  }

  /**
   * Get trending visa topics from multiple countries
   * @param {Array<string>} countries - Array of country names
   * @returns {Promise<Array>} Combined news from all countries
   */
  async getBatchNews(countries) {
    const promises = countries.map(country => this.getCountryNews(country));

    try {
      const results = await Promise.all(promises);
      // Flatten and sort by date
      return results
        .flat()
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } catch (error) {
      console.error('Error in batch news fetch:', error.message);
      return this.getMockGeneralNews();
    }
  }

  /**
   * Mock data for development/fallback
   */
  getMockNews(country) {
    const mockData = {
      'Portugal': [
        {
          title: `${country} Extends Digital Nomad Visa Validity Period`,
          description: 'Portuguese authorities announce extension of D8 visa validity from 1 to 2 years, making it more attractive for remote workers.',
          url: '#',
          source: 'SchengenVisaInfo',
          publishedAt: new Date().toISOString(),
          imageUrl: null,
          country: country,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        },
        {
          title: `New Tax Benefits for ${country} Digital Nomads`,
          description: 'The Portuguese government introduces favorable tax regime for new digital nomad visa holders.',
          url: '#',
          source: 'Portugal News',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          imageUrl: null,
          country: country,
          date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }
      ]
    };

    return mockData[country] || this.getMockGeneralNews().slice(0, 2);
  }

  /**
   * Mock general news
   */
  getMockGeneralNews() {
    return [
      {
        title: 'Global Digital Nomad Visa Programs See Record Applications',
        description: 'Countries across Europe and Latin America report unprecedented interest in remote work visa programs as hybrid work becomes the norm.',
        url: '#',
        source: 'Digital Nomad News',
        publishedAt: new Date().toISOString(),
        imageUrl: null,
        country: 'general',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'EU Considers Standardized Digital Nomad Visa Framework',
        description: 'European Union officials discuss harmonizing digital nomad visa requirements across member states to attract remote talent.',
        url: '#',
        source: 'EU Today',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: null,
        country: 'general',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Remote Work Revolution Drives New Immigration Policies Worldwide',
        description: 'Countries compete to attract digital nomads with improved visa programs and tax incentives.',
        url: '#',
        source: 'Remote Work Today',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        imageUrl: null,
        country: 'general',
        date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Spain Simplifies Digital Nomad Visa Application Process',
        description: 'New streamlined procedures reduce processing time from 12 weeks to 6 weeks for qualified applicants.',
        url: '#',
        source: 'Spain Insider',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        imageUrl: null,
        country: 'Spain',
        date: new Date(Date.now() - 259200000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Greece Announces 50% Tax Reduction for Digital Nomads',
        description: 'Greece sweetens the deal for remote workers with major tax benefits for the first seven years of residency.',
        url: '#',
        source: 'Greek Reporter',
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        imageUrl: null,
        country: 'Greece',
        date: new Date(Date.now() - 345600000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Mexico Temporary Resident Visa Applications Surge 300%',
        description: 'Record number of US-based remote workers relocate to Mexico, citing proximity and cost of living benefits.',
        url: '#',
        source: 'Mexico Daily',
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        imageUrl: null,
        country: 'Mexico',
        date: new Date(Date.now() - 432000000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Dubai Extends Virtual Working Program Indefinitely',
        description: 'UAE announces the temporary program will become permanent with enhanced features for tech professionals.',
        url: '#',
        source: 'Gulf News',
        publishedAt: new Date(Date.now() - 518400000).toISOString(),
        imageUrl: null,
        country: 'United Arab Emirates',
        date: new Date(Date.now() - 518400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Estonia E-Residency Program Hits 100,000 Members',
        description: 'Estonian digital residency program reaches major milestone as global interest in digital nomadism grows.',
        url: '#',
        source: 'Baltic Times',
        publishedAt: new Date(Date.now() - 604800000).toISOString(),
        imageUrl: null,
        country: 'Estonia',
        date: new Date(Date.now() - 604800000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      }
    ];
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
}

export default new NewsService();
