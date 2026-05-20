import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function IncomeInput({ value, onChange, onSubmit, error }) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-grow">
        <label htmlFor="monthly-income" className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
          <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-primary" />
          Your Monthly Income (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold" aria-hidden="true">$</span>
          <input
            id="monthly-income"
            type="number"
            value={value}
            onChange={onChange}
            placeholder="5000"
            min="0"
            step="100"
            aria-describedby="income-hint income-error"
            className="w-full bg-dark-900 border border-white/20 text-white rounded-xl px-12 py-4 text-xl font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600"
          />
        </div>
        <p id="income-hint" className="text-slate-500 text-sm mt-2">
          Enter your gross monthly income before taxes
        </p>
        {error && (
          <p id="income-error" role="alert" className="text-red-400 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-primary/50 flex items-center gap-2 whitespace-nowrap"
      >
        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
        Check Eligibility
      </button>
    </form>
  );
}
