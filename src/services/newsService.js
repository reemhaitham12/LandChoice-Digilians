import axios from 'axios';

class NewsService {
  constructor() {
    this.baseURL = 'https://back-end-pro.vercel.app/news/all-news';
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000;
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  setCached(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache() {
    this.cache.clear();
  }

  parseArticles(rawArticles) {
    if (!Array.isArray(rawArticles)) {
      rawArticles = rawArticles?.articles || rawArticles?.data || [];
    }

    return rawArticles
      .filter(article => article.title && article.description)
      .map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source?.name || article.source || 'Unknown',
        publishedAt: article.publishedAt,
        imageUrl: article.imageUrl || article.urlToImage || null,
        country: article.country || null,
        date: article.date || new Date(article.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
  }

  async getGeneralNews() {
    const cacheKey = 'news_general';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.baseURL);
      let articles = this.parseArticles(response.data);

      articles = articles.map(article => ({
        ...article,
        country: article.country || 'general'
      }));

      this.setCached(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('Error fetching general news:', error.message);
      return this.getMockGeneralNews();
    }
  }

  async getCountryNews(country) {
    const cacheKey = `news_${country}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.baseURL, {
        params: { country }
      });

      let articles = this.parseArticles(response.data);

      if (articles.length > 0) {
        articles = articles.map(article => ({
          ...article,
          country: article.country || country
        }));
        this.setCached(cacheKey, articles);
        return articles;
      }

      console.log(`No news found for ${country}, using mock data`);
      return this.getMockNews(country);
    } catch (error) {
      console.error('Error fetching country news:', error.message);
      return this.getMockNews(country);
    }
  }

  getMockNews(country) {
    const mockData = {
      'Portugal': [
        {
          title: 'Portugal D8 Digital Nomad Visa: New Requirements for 2025',
          description: 'Portuguese authorities announce updated income thresholds and new documentation requirements for digital nomad visa applicants.',
          url: 'https://news.google.com/search?q=Portugal+D8+Visa+2025',
          source: 'Portugal News',
          publishedAt: new Date().toISOString(),
          country: 'Portugal',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        },
        {
          title: 'Lisbon Sees Surge in Remote Worker Applications',
          description: 'Portuguese capital becomes top destination for digital nomads seeking EU residency through the D8 visa program.',
          url: 'https://news.google.com/search?q=Lisbon+Digital+Nomads',
          source: 'EU Travel Today',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          country: 'Portugal',
          date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Spain': [
        {
          title: 'Spain Digital Nomad Visa: 15% Tax Reduction Confirmed',
          description: 'Spanish government confirms income tax reduction for digital nomad visa holders for the first four years.',
          url: 'https://news.google.com/search?q=Spain+Digital+Nomad+Tax',
          source: 'Spain Travel Update',
          publishedAt: new Date().toISOString(),
          country: 'Spain',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        },
        {
          title: 'Barcelona Opens Coworking Visa Support Center',
          description: 'City hall opens dedicated office to help digital nomads navigate the Spanish visa application process.',
          url: 'https://news.google.com/search?q=Barcelona+Digital+Nomad',
          source: 'Barcelona Metropolitan',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          country: 'Spain',
          date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Germany': [
        {
          title: 'Germany Freelance Visa: New Online Portal Launch',
          description: 'German immigration launches digital platform for freelance visa applications reducing processing times significantly.',
          url: 'https://news.google.com/search?q=Germany+Freelance+Visa+Online',
          source: 'Berlin.de',
          publishedAt: new Date().toISOString(),
          country: 'Germany',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Greece': [
        {
          title: 'Greece Digital Nomad Visa: 50% Tax Reduction',
          description: 'Athens confirms significant tax incentives for remote workers holding the Greek digital nomad visa.',
          url: 'https://news.google.com/search?q=Greece+Digital+Nomad+Tax',
          source: 'Greek Travel News',
          publishedAt: new Date().toISOString(),
          country: 'Greece',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Italy': [
        {
          title: 'Italy Digital Nomad Visa: Income Requirements Lowered',
          description: 'Italian government reduces minimum monthly income requirement to €2,300 for digital nomad visa applicants.',
          url: 'https://news.google.com/search?q=Italy+Digital+Nomad+Income',
          source: 'Italy Travel Update',
          publishedAt: new Date().toISOString(),
          country: 'Italy',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Malta': [
        {
          title: 'Malta Nomad Residence Permit Renewals Hit Record',
          description: 'Island nation sees unprecedented number of remote workers choosing to extend their stay through the nomad permit program.',
          url: 'https://news.google.com/search?q=Malta+Nomad+Permit',
          source: 'Malta Independent',
          publishedAt: new Date().toISOString(),
          country: 'Malta',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Croatia': [
        {
          title: 'Croatia Digital Nomad Visa: Schengen Access Benefits',
          description: 'Remote workers highlight Schengen zone travel freedom as key benefit of Croatian digital nomad residence permit.',
          url: 'https://news.google.com/search?q=Croatia+Digital+Nomad+Schengen',
          source: 'Croatia Week',
          publishedAt: new Date().toISOString(),
          country: 'Croatia',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Estonia': [
        {
          title: 'Estonia Digital Nomad Visa Processing in 15 Days',
          description: 'Baltic nation maintains fastest digital nomad visa processing times in Europe at just two weeks.',
          url: 'https://news.google.com/search?q=Estonia+Digital+Nomad+Fast',
          source: 'Estonian World',
          publishedAt: new Date().toISOString(),
          country: 'Estonia',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Czech Republic': [
        {
          title: 'Czech Republic Updates Long-Term Business Visa Rules',
          description: 'Prague announces streamlined documentation requirements for long-term business visa applicants.',
          url: 'https://news.google.com/search?q=Czech+Business+Visa+2025',
          source: 'Prague Morning',
          publishedAt: new Date().toISOString(),
          country: 'Czech Republic',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Mexico': [
        {
          title: 'Mexico Temporary Resident Visa: Income Threshold Update',
          description: 'Mexican authorities adjust minimum income requirements for temporary resident visa applications.',
          url: 'https://news.google.com/search?q=Mexico+Temporary+Resident+Visa',
          source: 'Mexico News Daily',
          publishedAt: new Date().toISOString(),
          country: 'Mexico',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'Thailand': [
        {
          title: 'Thailand SMART Visa: Tech Industry Expansion',
          description: 'Bangkok expands SMART visa program to include additional tech and digital industry categories.',
          url: 'https://news.google.com/search?q=Thailand+SMART+Visa+Tech',
          source: 'Bangkok Post',
          publishedAt: new Date().toISOString(),
          country: 'Thailand',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ],
      'United Arab Emirates': [
        {
          title: 'Dubai Virtual Working Program: Tax-Free Income Benefits',
          description: 'Remote workers praise Dubai virtual working permit for tax-free income and world-class infrastructure.',
          url: 'https://news.google.com/search?q=Dubai+Virtual+Working+Tax',
          source: 'Gulf News',
          publishedAt: new Date().toISOString(),
          country: 'United Arab Emirates',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }
      ]
    };

    const rawArticles = mockData[country] || [];
    return this.parseArticles(rawArticles);
  }

  getMockGeneralNews() {
    const rawArticles = [
      {
        title: 'Schengen Area Updates Entry Requirements for 2025',
        description: 'New travel document rules and extended visa processing times announced for Schengen visa applicants worldwide.',
        url: 'https://news.google.com/search?q=Schengen+Visa+Requirements+2025',
        source: 'Travel Visa News',
        publishedAt: new Date().toISOString(),
        country: 'general',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      },
      {
        title: 'Top 10 Digital Nomad Destinations for 2025',
        description: 'Annual ranking reveals best countries for remote workers based on visa policies, cost of living, and internet speed.',
        url: 'https://news.google.com/search?q=Digital+Nomad+Destinations+2025',
        source: 'Nomad Guide',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        country: 'general',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    ];

    return this.parseArticles(rawArticles);
  }
}

export default new NewsService();