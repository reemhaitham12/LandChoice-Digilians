import AnimatedStat from '../ui/AnimatedStat';
import { faDollarSign, faClock, faShieldAlt, faStar } from '@fortawesome/free-solid-svg-icons';

export default function CountryStats({ country }) {
  return (
    <div className="max-w-5xl mx-auto px-6 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedStat 
          label="Min. Income" 
          value={`${country.currencySymbol}${country.minIncomeMonthly?.toLocaleString() || 0}`} 
          icon={faDollarSign} 
          color={country.color}
          unit="/mo"
        />
        <AnimatedStat 
          label="Duration" 
          value={country.durationMonths >= 12 ? Math.floor(country.durationMonths / 12) : country.durationMonths} 
          icon={faClock} 
          color={country.color}
          unit={country.durationMonths >= 12 ? 'yr' : 'mo'}
        />
        <AnimatedStat 
          label="Safety" 
          value={country.safetyRating || 0} 
          icon={faShieldAlt} 
          color={country.color}
          unit="/10"
        />
        <AnimatedStat 
          label="Quality of Life" 
          value={country.qualityOfLife || 0} 
          icon={faStar} 
          color="#f59e0b"
          unit="/10"
        />
      </div>
    </div>
  );
}