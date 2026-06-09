import React from 'react';
import { X } from 'lucide-react';

const CountryCard = ({ country, onRemove }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
        <button
          onClick={() => onRemove(country.country_id)}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold">{country.country}</h3>
        <p className="text-sm opacity-90">{country.visaName}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Difficulty:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(country.difficulty)}`}>
            {country.difficulty}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Min Income:</span>
          <span className="font-semibold">{country.currencySymbol}{country.minIncomeMonthly?.toLocaleString()}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold">{country.durationMonths} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Processing:</span>
          <span className="font-semibold">{country.processingWeeks} weeks</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cost:</span>
          <span className="font-semibold">${country.costUSD?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cost of Living:</span>
          <span className="font-semibold">{country.costOfLivingIndex}%</span>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;