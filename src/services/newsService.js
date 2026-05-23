import axios from 'axios';

/**
 * Service for fetching real-time news about visa requirements, travel documents, and entry policies
 * Uses NewsAPI.org for news aggregation
 */
class NewsService {
  constructor() {
    this.baseURL = 'https://newsapi.org/v2';
    
    // To use the live API:
    // 1. Get a free API key from https://newsapi.org/
    // 2. Create a .env file in the root of your project
    // 3. Add the following line to the .env file:
    //    VITE_NEWSAPI_KEY=your_api_key_here
    // 4. Restart your development server
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
   * Fetch visa requirements and travel document news for a specific country
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
      // ← كويري جديد: فيزا وأوراق سفر ومتطلبات دخول
      const query = `"${country}" AND ("visa requirements" OR "travel documents" OR "visa application" OR "entry requirements" OR "embassy visa" OR "consular services" OR "passport requirements" OR "visa fees" OR "travel advisory")`;

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
   * Fetch general visa and travel document news
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
      // ← كويري جديد: أخبار عامة عن الفيزا والأوراق
      const query = '"visa requirements" OR "travel documents" OR "visa application guide" OR "entry requirements" OR "embassy updates" OR "consular news" OR "passport requirements" OR "travel advisory" OR "visa policy changes"';

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
          title: `${country} Updates Visa Requirements for Non-EU Travelers`,
          description: 'Portuguese embassy announces new document checklist including proof of accommodation, travel insurance, and financial means for tourist visa applications.',
          url: `https://news.google.com/search?q=${encodeURIComponent(country + ' visa requirements')}`,
          source: 'SchengenVisaInfo',
          publishedAt: new Date().toISOString(),
          imageUrl: null,
          country: country,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        },
        {
          title: `New Online Visa Application System Launched in ${country}`,
          description: 'Portugal introduces digital visa portal allowing applicants to submit documents online and track application status in real-time.',
          url: `https://news.google.com/search?q=${encodeURIComponent(country + ' visa application online')}`,
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
        title: 'Schengen Area Updates Entry Requirements for 2025',
        description: 'New travel document rules and extended visa processing times announced for Schengen visa applicants worldwide.',
        url: 'https://news.google.com/search?q=Schengen+Visa+Requirements+2025',
        source: 'Travel Visa News',
        publishedAt: new Date().toISOString(),
        imageUrl: null,
        country: 'general',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'UK Embassy Announces New Document Verification Process',
        description: 'British consular services introduce additional security checks for visa applications requiring updated passport and bank statement formats.',
        url: 'https://news.google.com/search?q=UK+Visa+Documents+2025',
        source: 'UK Visa Guide',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: null,
        country: 'general',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Dubai Streamlines Tourist Visa Application Process',
        description: 'UAE reduces required documents and introduces express 48-hour visa processing for eligible travelers.',
        url: 'https://news.google.com/search?q=Dubai+Tourist+Visa+Application',
        source: 'Gulf Travel News',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        imageUrl: null,
        country: 'United Arab Emirates',
        date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Spain Updates Financial Requirements for Visa Applicants',
        description: 'New minimum bank balance requirements and updated proof of income documents needed for Spanish tourist and student visas.',
        url: 'https://news.google.com/search?q=Spain+Visa+Financial+Requirements',
        source: 'Spain Travel Update',
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        imageUrl: null,
        country: 'Spain',
        date: new Date(Date.now() - 259200000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Japan Expands Visa-Free Entry for Select Nationalities',
        description: 'Japanese immigration announces extended visa-free stays and simplified entry procedures for tourists from 10 additional countries.',
        url: 'https://news.google.com/search?q=Japan+Visa+Free+Entry+2025',
        source: 'Asia Travel News',
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        imageUrl: null,
        country: 'Japan',
        date: new Date(Date.now() - 345600000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Germany Introduces Digital Visa Appointment System',
        description: 'New online booking platform for embassy visa appointments reduces wait times and allows document pre-upload.',
        url: 'https://news.google.com/search?q=Germany+Visa+Appointment+System',
        source: 'EU Travel Today',
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        imageUrl: null,
        country: 'Germany',
        date: new Date(Date.now() - 432000000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Australia Updates Health Insurance Requirements for Visitors',
        description: 'New mandatory travel insurance coverage amounts and approved provider list released for Australian visa applicants.',
        url: 'https://news.google.com/search?q=Australia+Visa+Insurance+Requirements',
        source: 'Pacific Travel News',
        publishedAt: new Date(Date.now() - 518400000).toISOString(),
        imageUrl: null,
        country: 'Australia',
        date: new Date(Date.now() - 518400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      },
      {
        title: 'Thailand Extends Visa on Arrival for 30 More Days',
        description: 'Tourist visa exemption period extended allowing travelers to stay up to 60 days with simplified border crossing documents.',
        url: 'https://news.google.com/search?q=Thailand+Visa+On+Arrival+2025',
        source: 'Southeast Asia Travel',
        publishedAt: new Date(Date.now() - 604800000).toISOString(),
        imageUrl: null,
        country: 'Thailand',
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