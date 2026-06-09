import React from 'react';
import { TrendingDown, Zap, Shield, DollarSign } from 'lucide-react';

const Highlights = ({ countries }) => {
  if (countries.length < 2) return null;

  const lowestCost = [...countries].sort(
    (a, b) => a.costOfLivingIndex - b.costOfLivingIndex
  )[0];

  const fastestProcessing = [...countries].sort(
    (a, b) => a.processingWeeks - b.processingWeeks
  )[0];

  const safest = [...countries].sort(
    (a, b) => b.safetyRating - a.safetyRating
  )[0];

  const lowestIncome = [...countries].sort(
    (a, b) => a.minIncomeMonthly - b.minIncomeMonthly
  )[0];

  const highlights = [
    {
      icon: DollarSign,
      label: 'Lowest Cost',
      value: lowestCost.country,
    },
    {
      icon: Zap,
      label: 'Fastest Processing',
      value: fastestProcessing.country,
    },
    {
      icon: Shield,
      label: 'Safest',
      value: safest.country,
    },
    {
      icon: TrendingDown,
      label: 'Lowest Income',
      value: lowestIncome.country,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {highlights.map((item, index) => (
        <div
          key={index}
          className="
            bg-[#0F172A]
            border border-white/5
            rounded-2xl
            p-5
            text-center
            hover:border-[#6C8FD9]/20
            transition-all
          "
        >
          <div className="w-10 h-10 rounded-xl bg-[#6C8FD9]/10 flex items-center justify-center mx-auto mb-3">
            <item.icon className="w-5 h-5 text-[#6C8FD9]" />
          </div>

          <div className="text-xs text-[#6C8FD9] uppercase tracking-wider mb-1">
            {item.label}
          </div>

          <div className="text-base md:text-lg font-semibold text-white">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Highlights;