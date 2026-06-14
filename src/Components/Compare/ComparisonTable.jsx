import React from 'react';

const ComparisonTable = ({ countries }) => {
  if (countries.length < 2) return null;

  const getCostOfLivingLabel = (index) => {
    if (index >= 80) return 'Very High';
    if (index >= 70) return 'High';
    if (index >= 50) return 'Moderate';
    return 'Low';
  };

  const rows = [
    { label: "Visa Type", key: "visaName" },
    { label: "Category", key: "visaType" },
    {
      label: "Minimum Income (Monthly)",
      key: "minIncomeMonthly",
      format: (v, c) => `${c.currencySymbol}${v?.toLocaleString()}`
    },
    {
      label: "Minimum Income (USD)",
      key: "costUSD",
      format: (v) => `$${v?.toLocaleString()}`
    },
    {
      label: "Duration",
      key: "durationMonths",
      format: (v) => `${v} months`
    },
    {
      label: "Renewable",
      key: "renewableYears",
      format: (v) => v === 0 ? 'Non-renewable' : `Up to ${v} years`
    },
    {
      label: "Processing Time",
      key: "processingWeeks",
      format: (v) => `${v} weeks`
    },
    {
      label: "Visa Cost",
      key: "costUSD",
      format: (v) => `$${v?.toLocaleString()}`
    },
    {
      label: "Cost of Living Index",
      key: "costOfLivingIndex",
      format: (v) => `${v} (${getCostOfLivingLabel(v)})`
    },
    {
      label: "Safety Rating",
      key: "safetyRating",
      format: (v) => `${v}/10`
    },
    {
      label: "Internet Speed",
      key: "internetSpeed",
      format: (v) => `${v} Mbps`
    },
    {
      label: "English Proficiency",
      key: "englishProficiency"
    },
    {
      label: "Timezone",
      key: "timezone"
    },
  ];

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#6C8FD9]/10 border-b border-[#6C8FD9]/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#6C8FD9]">
                Criteria
              </th>

              {countries.map((country) => (
                <th
                  key={country.country_id}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#6C8FD9]"
                >
                  {country.country}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr
                key={row.label}
                className="hover:bg-[#6C8FD9]/5 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-400 font-medium whitespace-nowrap">
                  {row.label}
                </td>

                {countries.map((country) => (
                  <td
                    key={country.country_id}
                    className="px-6 py-4 text-sm text-gray-200"
                  >
                    {row.format
                      ? row.format(country[row.key], country)
                      : country[row.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;