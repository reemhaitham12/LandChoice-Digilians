import AnimatedStat from '../ui/AnimatedStat';
import { faDollarSign, faClock, faShieldAlt, faStar } from '@fortawesome/free-solid-svg-icons';

export default function CountryStats({ country }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <AnimatedStat label="Min Income"  value={country.minIncomeMonthly} icon={faDollarSign} />
      <AnimatedStat label="Duration"    value={country.durationMonths}   icon={faClock}      />
      <AnimatedStat label="Safety"      value={country.safetyRating}     icon={faShieldAlt}  />
      <AnimatedStat label="QoL"         value={country.qualityOfLife}    icon={faStar}       />
    </div>
  );
}
