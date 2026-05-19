import { useState } from 'react';

const InputField = ({ type = 'text', placeholder, value, onChange, icon, error, name }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-5">
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-gray-400'}`}>
          {icon}
        </div>
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-10 pr-10 py-3.5 bg-white/[0.02] border rounded-xl text-white placeholder-gray-500 transition-all duration-300 outline-none ${
            isFocused 
              ? 'border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-white/[0.05]' 
              : 'border-white/20 hover:border-white/30'
          } ${error ? 'border-red-400/50' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${isFocused ? 'w-full' : 'w-0'}`}></div>
      </div>
      {error && (
        <div className="mt-1.5 flex items-center gap-1 pl-2">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
