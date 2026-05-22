import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChartLine } from '@fortawesome/free-solid-svg-icons';

export default function IncomeInput({ value, onChange, onSubmit, error }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faDollarSign} className="text-primary text-sm" />
        <label htmlFor="monthly-income" className="text-white font-bold text-base">
          Your Monthly Income (USD)
        </label>
      </div>

      {/* Input row */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 relative">
          {/* $ prefix box */}
          <div className="flex items-center bg-dark-900 border border-white/15 rounded-xl overflow-hidden focus-within:border-primary transition-colors">
            <span className="px-4 text-slate-400 font-bold text-lg select-none border-r border-white/10 h-14 flex items-center">
              $
            </span>
            <input
              id="monthly-income"
              type="number"
              value={value}
              onChange={onChange}
              placeholder="5000"
              min="0"
              step="100"
              aria-describedby="income-hint income-error"
              className="flex-1 bg-transparent text-white text-lg font-bold px-4 h-14 focus:outline-none placeholder:text-slate-600"
            />
          </div>
          <p id="income-hint" className="text-slate-500 text-xs mt-2 ml-1">
            Enter your gross monthly income before taxes
          </p>
          {error && (
            <p id="income-error" role="alert" className="text-red-400 text-xs mt-1 ml-1">
              {error}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="h-14 px-7 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg hover:shadow-primary/40 flex items-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faChartLine} />
          Check Eligibility
        </button>
      </div>
    </form>
  );
}
