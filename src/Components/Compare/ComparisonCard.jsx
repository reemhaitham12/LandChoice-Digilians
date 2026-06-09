import React from 'react';

const ComparisonCard = ({ country }) => {
  const getDifficultyBadge = (difficulty) => {
    const colors = {
      Easy: 'bg-green-500/10 text-green-400 border border-green-500/20',
      Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      Hard: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };

    return (
      colors[difficulty] ||
      'bg-[#6C8FD9]/10 text-[#6C8FD9] border border-[#6C8FD9]/20'
    );
  };

  const getCostOfLivingLabel = (index) => {
    if (index >= 80) return 'Very High';
    if (index >= 70) return 'High';
    if (index >= 50) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-white/5 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-[#6C8FD9]/10 border-b border-[#6C8FD9]/20 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {country.country}
        </h2>

        <p className="text-sm text-[#6C8FD9] mt-1">
          {country.visaName}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Difficulty */}
        <div className="mb-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(
              country.difficulty
            )}`}
          >
            {country.difficulty}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-8">

          <InfoItem
            label="Visa Name"
            value={country.visaName}
          />

          <InfoItem
            label="Category"
            value={country.visaType}
          />

          <InfoItem
            label="Min Income (Monthly)"
            value={`${country.currencySymbol}${country.minIncomeMonthly?.toLocaleString()}`}
          />

          <InfoItem
            label="Min Income (USD)"
            value={`$${country.costUSD?.toLocaleString()}`}
          />

          <InfoItem
            label="Duration"
            value={`${country.durationMonths} months`}
          />

          <InfoItem
            label="Renewable"
            value={
              country.renewableYears === 0
                ? 'Non-renewable'
                : `Up to ${country.renewableYears} years`
            }
          />

          <InfoItem
            label="Processing Time"
            value={`${country.processingWeeks} weeks`}
          />

          <InfoItem
            label="Visa Cost"
            value={`$${country.costUSD?.toLocaleString()}`}
          />

          <InfoItem
            label="Cost of Living"
            value={`${country.costOfLivingIndex} (${getCostOfLivingLabel(
              country.costOfLivingIndex
            )})`}
          />

          <InfoItem
            label="Safety Rating"
            value={`${country.safetyRating}/10`}
          />

          <InfoItem
            label="Internet Speed"
            value={`${country.internetSpeed} Mbps`}
          />

          <InfoItem
            label="English Proficiency"
            value={country.englishProficiency}
          />

          <InfoItem
            label="Timezone"
            value={country.timezone}
          />
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">
            Key Requirements
          </h3>

          <ul className="space-y-2">
            {country.requirements?.slice(0, 4).map((req, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-400 flex items-start gap-2"
              >
                <span className="text-[#6C8FD9] mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">
            Key Benefits
          </h3>

          <ul className="space-y-2">
            {country.benefits?.slice(0, 4).map((benefit, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-400 flex items-start gap-2"
              >
                <span className="text-[#f29706] mt-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Best For */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Best For
          </h3>

          <div className="flex flex-wrap gap-2">
            {country.bestFor?.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-[#6C8FD9]/10 text-[#6C8FD9] border border-[#6C8FD9]/20 rounded-lg text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <div className="text-xs text-[#6C8FD9] uppercase tracking-wider mb-1">
      {label}
    </div>

    <div className="text-sm text-gray-200">
      {value}
    </div>
  </div>
);

export default ComparisonCard;