import { useState, useEffect } from 'react';
import { useVisa } from '../context/visaContext';
import {
  Check,
  Download,
  Globe,
  DollarSign,
  Clock,
  BarChart3,
  CreditCard,
  FileText,
  AlertTriangle,
  Users,
  PartyPopper,
  ChevronDown,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Loading from '../Components/Loading';
import { useVisa } from '../context/visaContext';

const Checklist = () => {

  const { visaData, loading } = useVisa();


  const [selectedCountry, setSelectedCountry] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (visaData.length > 0 && !selectedCountry) {
      setSelectedCountry(visaData[0]);
    }
  }, [visaData, selectedCountry]);

  useEffect(() => {
    const saved = localStorage.getItem('visa-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {
        console.error('Failed to load saved checklist');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visa-checklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading visa data...</span>
        </div>
      </div>
    );
  }

  if (!visaData || visaData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <div className="text-center">
          <AlertTriangle size={32} className="mx-auto mb-2 text-red-400" />
          <p>Failed to load visa data</p>
          <p className="text-sm text-slate-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!selectedCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Preparing checklist...</span>
        </div>
      </div>

    );
  }

  const getProgress = () => {
    const total = selectedCountry.requirements.length;
    const completed = selectedCountry.requirements.filter((_, i) =>
      checkedItems[`${selectedCountry.country_id}_${i}`]
    ).length;

    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  };

  const toggleItem = (index) => {
    const key = `${selectedCountry.country_id}_${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearAll = () => {
    const updated = { ...checkedItems };
    selectedCountry.requirements.forEach((_, i) => {
      delete updated[`${selectedCountry.country_id}_${i}`];
    });
    setCheckedItems(updated);
  };

  const exportToPDF = () => {
    const { completed, total, percentage } = getProgress();
    const doc = new jsPDF();

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('Document Checklist', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`${selectedCountry.country} - ${selectedCountry.visaName}`, 105, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Progress: ${completed}/${total} (${Math.round(percentage)}%)`, 105, 36, { align: 'center' });

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(20, 42, 170, 6, 2, 2, 'F');

    if (percentage > 0) {
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(20, 42, (170 * percentage) / 100, 6, 2, 2, 'F');
    }

    let y = 58;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('REQUIREMENTS', 20, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    selectedCountry.requirements.forEach((req, i) => {
      const isChecked = checkedItems[`${selectedCountry.country_id}_${i}`];
      const mark = isChecked ? '[X]' : '[  ]';
      const lines = doc.splitTextToSize(`${mark} ${req}`, 170);

      if (y > 270) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }

      doc.text(lines, 20, y);
      y += lines.length * 5 + 3;
    });

    y += 5;

    if (y > 250) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text('KEY BENEFITS', 20, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    selectedCountry.benefits.forEach((benefit) => {
      const lines = doc.splitTextToSize(`• ${benefit}`, 170);
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * 5 + 2;
    });

    y += 5;

    if (y > 250) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(234, 179, 8);
    doc.text('IMPORTANT RESTRICTIONS', 20, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    selectedCountry.restrictions.forEach((restriction) => {
      const lines = doc.splitTextToSize(`• ${restriction}`, 170);
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * 5 + 2;
    });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by NomadVisa - https://nomadvisa.com', 105, 290, { align: 'center' });

    doc.save(`${selectedCountry.country.replace(/\s+/g, '_')}_checklist.pdf`);
  };

  const handleCountryChange = (e) => {
    const country = visaData.find((c) => c.country_id === e.target.value);
    setSelectedCountry(country);
  };

  const progress = getProgress();

  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400'
  };

  const difficultyIcons = {
    Easy: <TrendingUp size={14} className="text-green-400" />,
    Medium: <TrendingUp size={14} className="text-yellow-400" />,
    Hard: <TrendingUp size={14} className="text-red-400" />
  };

  return (
    <div className="min-h-screen text-slate-100">


      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header — نفس style الـ News */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mt-12 py-8">
            <FileText className="text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-4xl font-display font-bold">
              <span className="text-slate-100">Document </span>
              <span className="gradient-text">Checklist</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base px-2 sm:px-0 max-w-2xl mx-auto">
            Track all required documents for your visa application. Check off
            items as you complete them and monitor your progress.
          </p>
        </div>

        {/* Country Selector & Info Cards */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
          <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Globe size={14} />
            Select Destination Country
          </label>

          <div className="relative mb-4">
            <button
              onClick={() => setOpen(!open)}
              className="w-full bg-[#1a2235] border border-gray-700 rounded-lg px-4 py-3 text-slate-100 flex justify-between items-center text-sm sm:text-base hover:border-gray-600 transition-colors duration-300"
            >
              <span className="truncate mr-2">
                {selectedCountry.country} - {selectedCountry.visaName}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${open ? 'rotate-180' : ''}`}
              />
            </button>

            <div

              className={`absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-top shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-md bg-[#111827]/95 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent ${
                open
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 -translate-y-3 scale-[0.98] pointer-events-none'
              }`}
            >
              {visaData.map((country, idx) => (
                <div
                  key={country.country_id}
                  onClick={() => {
                    setSelectedCountry(country);
                    setOpen(false);
                  }}
                  style={{ transitionDelay: open ? `${idx * 25}ms` : '0ms' }}
                  className={`px-4 py-3 cursor-pointer transition-all duration-300 ease-out border-b border-white/5 last:border-0 hover:bg-blue-500/10 hover:pl-6 text-sm sm:text-base text-slate-300 hover:text-slate-100 ${
                    open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{country.country} - {country.visaName}</span>
                    {selectedCountry.country_id === country.country_id && (
                      <Check size={14} className="text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
                <DollarSign size={12} />
                Income
              </div>
              <div className="font-bold text-sm sm:text-base text-slate-100">
                {selectedCountry.currencySymbol}
                {selectedCountry.minIncomeMonthly.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
                <Clock size={12} />
                Processing
              </div>
              <div className="font-bold text-sm sm:text-base text-slate-100">
                {selectedCountry.processingWeeks} weeks
              </div>
            </div>

            <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
                <BarChart3 size={12} />
                Difficulty
              </div>
              <div className={`font-bold text-sm sm:text-base flex items-center justify-center gap-1 ${difficultyColors[selectedCountry.difficulty]}`}>
                {difficultyIcons[selectedCountry.difficulty]}
                {selectedCountry.difficulty}
              </div>
            </div>

            <div className="bg-[#0a0f1e] border border-gray-800 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mb-1">
                <CreditCard size={12} />
                Cost
              </div>
              <div className="font-bold text-sm sm:text-base text-slate-100">
                ${selectedCountry.costUSD}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-400" />
                <h2 className="font-bold text-base sm:text-lg text-slate-100">Your Progress</h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {progress.completed} of {progress.total} requirements completed
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {Math.round(progress.percentage)}%
              </div>
              <div className="text-sm text-slate-500">Complete</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Requirements List */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b border-gray-800 gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-400" />
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-100">Required Documents</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20 transition flex-1 sm:flex-none"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/20 transition flex-1 sm:flex-none"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            {selectedCountry.requirements.map((req, index) => {
              const isChecked =
                checkedItems[`${selectedCountry.country_id}_${index}`] || false;

              return (
                <div
                  key={index}
                  onClick={() => toggleItem(index)}
                  className="flex items-start gap-3 p-3 sm:p-4 cursor-pointer transition hover:bg-gray-800/30"
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isChecked
                        ? 'bg-blue-500 border-blue-500 scale-110'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {isChecked && (
                      <Check size={12} strokeWidth={3} className="text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm sm:text-base break-words transition-colors duration-300 ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {req}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Requirement {index + 1} of {selectedCountry.requirements.length}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits & Restrictions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2 text-sm sm:text-base font-display">
              <Check size={18} />
              Key Benefits
            </h3>
            <ul className="space-y-2">
              {selectedCountry.benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-300 flex items-start gap-2"
                >
                  <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                  <span className="break-words">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-6">
            <h3 className="font-bold text-yellow-400 mb-4 flex items-center gap-2 text-sm sm:text-base font-display">
              <AlertTriangle size={18} />
              Important Restrictions
            </h3>
            <ul className="space-y-2">
              {selectedCountry.restrictions.map((restriction, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-300 flex items-start gap-2"
                >
                  <AlertTriangle size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                  <span className="break-words">{restriction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best For Tags */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Users size={14} />
            Best suited for:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCountry.bestFor.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Celebration */}
        {progress.percentage === 100 && (
          <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <PartyPopper size={32} className="text-green-400" />
            </div>
            <div className="text-green-400 font-bold text-lg font-display">
              All Requirements Complete!
            </div>
            <p className="text-slate-400 text-sm mt-1">
              You're ready to apply for {selectedCountry.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;