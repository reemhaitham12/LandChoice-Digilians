import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisa } from '../context/visaContext';
import Loading from '../Components/Loading';
import CountryHero from '../Components/country/CountryHero';
import CountryStats from '../Components/country/CountryStats';
import CountryTabs from '../Components/country/CountryTabs';
import OverviewTab from '../tabs/OverviewTab';
import ProgramTab from '../tabs/ProgramTab';
import RequirementsTab from '../tabs/RequirementsTab';
import CostsTab from '../tabs/CostsTab';
import ProsConsTab from '../tabs/ProsConsTab';
import SourcesTab from '../tabs/SourcesTab';

export default function CountryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { visaData = [], loading } = useVisa();

  //  Read directly from local visaData — no backend needed
  const country =
    visaData.find(
      c =>
        c.id === id ||
        c.country_id === id ||
        c._id === id
    ) ?? null;

  if (loading) {
    return <Loading />;
  }
  if (!country) {
    return (
      <div className="min-h-screen bg-dark-900 pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4"></div>
          <h2 className="text-white text-2xl font-bold mb-2">Country Not Found</h2>
          <p className="text-slate-400 mb-6">We couldn't find a visa program for this country.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-light transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab country={country} />;
      case 'program': return <ProgramTab country={country} />;
      case 'requirements': return <RequirementsTab country={country} />;
      case 'costs': return <CostsTab country={country} />;
      case 'procon': return <ProsConsTab country={country} />;
      case 'sources': return <SourcesTab country={country} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-20">
      {/* Background glow */}
      <div
        className="fixed top-0 left-0 w-full h-96 pointer-events-none opacity-10"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${country.color}, transparent)`
        }}
      />

      <CountryHero country={country} navigate={navigate} />
      <CountryStats country={country} />
      <CountryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
