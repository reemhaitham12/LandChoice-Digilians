import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss, faExternalLinkAlt, faCalendarAlt, faFilter, faSyncAlt, faSpinner, faGlobe, faChartLine } from '@fortawesome/free-solid-svg-icons';
import newsService from '../services/newsService';
import { useVisa } from '../context/visaContext'; 

const News = () => {
  const { visaData, loading: visaLoading } = useVisa(); 

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';

  const countries = [
    { id: 'all', name: 'All Countries' },
    ...(visaData ? visaData.map(v => ({ id: v.country, name: v.country })) : [])
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCountry]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let news;
      if (selectedCountry === 'all') {
        news = await newsService.getGeneralNews();
      } else {
        news = await newsService.getCountryNews(selectedCountry);
      }
      setArticles(news);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    newsService.clearCache();
    fetchNews();
  };

  
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = PLACEHOLDER_IMAGE;
  };

  if (visaLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 md:p-12 mb-10 pt-24 md:pt-32">
        <div className="flex flex-col items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-primary fa-spin mb-4" />
          <p className="text-slate-400">Loading countries data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto md:p-12 pt-24 md:pt-32 mb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2 rounded-full font-bold mb-6 text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)]">
          <FontAwesomeIcon icon={faRss} className="w-4 h-4 animate-pulse" /> Live Updates
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Visa Policy <span className="gradient-text">News & Updates</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Stay informed with the latest visa changes, immigration policies, and digital nomad news from around the world.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-grow w-full md:w-auto">
          <FontAwesomeIcon icon={faFilter} className="w-5 h-5 text-primary" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-[#0a0f1e] border border-gray-700 text-white rounded-xl px-4 py-2.5 flex-grow md:w-64 focus:outline-none focus:border-blue-500 text-sm font-medium"
          >
            {countries.map(country => (
              <option 
                key={country.id} 
                value={country.id}
                className="bg-[#0a0f1e] text-white"
                style={{ backgroundColor: '#0a0f1e', color: 'white' }}
              >
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-green-400" />
            <span>{articles.length} articles</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 py-2 px-4 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSyncAlt} className={`w-4 h-4 ${refreshing ? 'fa-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-primary fa-spin mb-4" />
          <p className="text-slate-400">Loading latest news...</p>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && articles.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCountry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {articles.map((article, idx) => (
              <motion.a
                key={`${article.url}-${idx}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card flex flex-col justify-between rounded-3xl group cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
              >
                {/* Image with fallback */}
                <div className="w-full h-48 overflow-hidden bg-dark-900">
                  <img
                    src={article.imageUrl || PLACEHOLDER_IMAGE}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  {/* Source & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {article.source}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" /> {article.date}
                    </span>
                  </div>

                  {/* Country Tag */}
                  {article.country && article.country !== 'general' && (
                    <div className="flex items-center gap-2 mb-3">
                      <FontAwesomeIcon icon={faGlobe} className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{article.country}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-display font-bold mb-3 text-slate-100 group-hover:text-primary-light transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {article.description}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-primary-light font-medium text-sm border-t border-white/10 pt-4 w-full group-hover:text-white transition-colors">
                    Read Full Article <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 ml-auto" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-3xl text-center"
        >
          <FontAwesomeIcon icon={faRss} className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No News Available</h3>
          <p className="text-slate-400 mb-6">
            {selectedCountry === 'all'
              ? 'No recent news found. Try again later or check individual countries.'
              : `No recent news found for ${selectedCountry}. Try selecting a different country or view all news.`}
          </p>
          <button
            onClick={() => setSelectedCountry('all')}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 py-2 px-6 rounded-xl transition-all text-sm font-medium"
          >
            View All News
          </button>
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 glass-card p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faRss} className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">About These News Articles</h4>
            <p className="text-slate-400 text-sm">
              News articles are automatically aggregated from reputable sources worldwide and filtered for relevance to visa policies, immigration laws, and digital nomad topics. Articles are cached for 30 minutes to ensure fast loading times.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default News;