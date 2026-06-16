import { useEffect, useState } from "react";
import { Search, Plus, X, ChevronLeft, ChevronRight, Check, AlertCircle, CheckCircle } from "lucide-react";
import {
  getAllCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../../Services/country/countryService";

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-sm max-w-sm w-full animate-in slide-in-from-top-2 duration-300
        ${isError
          ? "bg-red-500/20 border-red-500/40 text-red-300"
          : "bg-green-500/20 border-green-500/40 text-green-300"
        }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isError
          ? <AlertCircle className="w-5 h-5" />
          : <CheckCircle className="w-5 h-5" />
        }
      </div>
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onClose} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function CountriesTab() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Basic Info", "Financial & Duration", "Ratings & Location", "Details & Arrays"];

  const [toast, setToast] = useState({ message: "", type: "" });
  const [stepError, setStepError] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast({ message: "", type: "" });

  useEffect(() => {
    if (toast.message) {
      const duration = toast.type === "error" ? 5000 : 3000;
      const timer = setTimeout(hideToast, duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (stepError) {
      const timer = setTimeout(() => setStepError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [stepError]);

  const [touchedFields, setTouchedFields] = useState({});

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleCoordinatesChange = (coord, value) => {
    setForm((prev) => ({
      ...prev,
      coordinates: { ...prev.coordinates, [coord]: value },
    }));
    setTouchedFields((prev) => ({ ...prev, [`coordinates_${coord}`]: true }));
  };

  const initialFormState = {
    country_id: "",
    country: "",
    countryCode: "",
    visaName: "",
    visaType: "Residence",
    difficulty: "Medium",
    minIncomeMonthly: "",
    minIncomeYearly: "",
    currency: "USD",
    currencySymbol: "$",
    durationMonths: "",
    renewableYears: "",
    processingWeeks: "",
    costUSD: "",
    costOfLivingIndex: "",
    color: "#3b82f6",
    safetyRating: "",
    internetSpeed: "",
    englishProficiency: "Moderate",
    timezone: "",
    qualityOfLife: "",
    popular: false,
    featured: false,
    coordinates: { lat: "", lng: "" },
    requirements: [],
    benefits: [],
    restrictions: [],
    bestFor: [],
  };

  const [form, setForm] = useState(initialFormState);
  const [tempRequirement, setTempRequirement] = useState("");
  const [tempBenefit, setTempBenefit] = useState("");
  const [tempRestriction, setTempRestriction] = useState("");
  const [tempBestFor, setTempBestFor] = useState("");

  const getMissingFields = () => {
    const missing = [];
    if (currentStep === 0) {
      if (!form.country_id) missing.push("Country ID");
      if (!form.country) missing.push("Country Name");
      if (!form.countryCode) missing.push("Country Code");
      if (!form.visaName) missing.push("Visa Name");
    }
    if (currentStep === 1) {
      if (!form.minIncomeMonthly) missing.push("Min Income Monthly");
      if (!form.minIncomeYearly) missing.push("Min Income Yearly");
      if (!form.currency) missing.push("Currency");
      if (!form.currencySymbol) missing.push("Currency Symbol");
      if (!form.durationMonths) missing.push("Duration");
      if (!form.renewableYears) missing.push("Renewable Years");
      if (!form.processingWeeks) missing.push("Processing Weeks");
      if (!form.costUSD) missing.push("Cost USD");
      if (!form.costOfLivingIndex) missing.push("Cost of Living Index");
    }
    if (currentStep === 2) {
      if (!form.safetyRating) missing.push("Safety Rating");
      if (!form.internetSpeed) missing.push("Internet Speed");
      if (!form.timezone) missing.push("Timezone");
      if (!form.qualityOfLife) missing.push("Quality of Life");
      if (!form.coordinates.lat) missing.push("Latitude");
      if (!form.coordinates.lng) missing.push("Longitude");
    }
    if (currentStep === 3) {
      if (form.requirements.length === 0) missing.push("Requirements (at least one)");
      if (form.benefits.length === 0) missing.push("Benefits (at least one)");
      if (form.restrictions.length === 0) missing.push("Restrictions (at least one)");
      if (form.bestFor.length === 0) missing.push("Best For (at least one)");
    }
    return missing;
  };

  const isStepValid = () => getMissingFields().length === 0;

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setStepError("");
    } else {
      const missing = getMissingFields();
      setStepError(`Please complete: ${missing.join(", ")}`);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setStepError("");
  };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getAllCountries();
      setCountries(data.countries || data || []);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch countries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.country?.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setForm(initialFormState);
    setTempRequirement("");
    setTempBenefit("");
    setTempRestriction("");
    setTempBestFor("");
    setTouchedFields({});
    setStepError("");
    hideToast();
    setIsEditing(false);
    setShowAddForm(true);
    setCurrentStep(0);
  };

  const addToArray = (value, setter, arrayField) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [arrayField]: [...prev[arrayField], value.trim()],
      }));
      setter("");
    }
  };

  const removeFromArray = (index, arrayField) => {
    setForm((prev) => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (country) => {
    setForm({
      country_id: country.country_id || country._id,
      country: country.country || "",
      countryCode: country.countryCode || "",
      visaName: country.visaName || "",
      visaType: country.visaType || "Residence",
      difficulty: country.difficulty || "Medium",
      minIncomeMonthly: country.minIncomeMonthly || "",
      minIncomeYearly: country.minIncomeYearly || "",
      currency: country.currency || "USD",
      currencySymbol: country.currencySymbol || "$",
      durationMonths: country.durationMonths || "",
      renewableYears: country.renewableYears || "",
      processingWeeks: country.processingWeeks || "",
      costUSD: country.costUSD || "",
      costOfLivingIndex: country.costOfLivingIndex || "",
      color: country.color || "#3b82f6",
      safetyRating: country.safetyRating || "",
      internetSpeed: country.internetSpeed || "",
      englishProficiency: country.englishProficiency || "Moderate",
      timezone: country.timezone || "",
      qualityOfLife: country.qualityOfLife || "",
      popular: country.popular || false,
      featured: country.featured || false,
      coordinates: {
        lat: country.coordinates?.lat || "",
        lng: country.coordinates?.lng || "",
      },
      requirements: country.requirements || [],
      benefits: country.benefits || [],
      restrictions: country.restrictions || [],
      bestFor: country.bestFor || [],
    });
    setTouchedFields({});
    setTempRequirement("");
    setTempBenefit("");
    setTempRestriction("");
    setTempBestFor("");
    setStepError("");
    hideToast();
    setIsEditing(true);
    setShowAddForm(true);
    setCurrentStep(0);
  };

  const handleSave = async () => {
    if (form.requirements.length === 0) {
      showToast("Please add at least one requirement", "error");
      return;
    }
    if (form.benefits.length === 0) {
      showToast("Please add at least one benefit", "error");
      return;
    }
    if (form.restrictions.length === 0) {
      showToast("Please add at least one restriction", "error");
      return;
    }
    if (form.bestFor.length === 0) {
      showToast("Please add at least one 'Best For' category", "error");
      return;
    }

    try {
      const submitData = {
        ...form,
        minIncomeMonthly: Number(form.minIncomeMonthly),
        minIncomeYearly: Number(form.minIncomeYearly),
        durationMonths: Number(form.durationMonths),
        renewableYears: Number(form.renewableYears),
        processingWeeks: Number(form.processingWeeks),
        costUSD: Number(form.costUSD),
        costOfLivingIndex: Number(form.costOfLivingIndex),
        safetyRating: Number(form.safetyRating),
        internetSpeed: Number(form.internetSpeed),
        qualityOfLife: Number(form.qualityOfLife),
        coordinates: {
          lat: Number(form.coordinates.lat),
          lng: Number(form.coordinates.lng),
        },
      };

      if (isEditing) {
        await updateCountry(form.country_id, submitData);
        showToast("Country updated successfully!", "success");
      } else {
        await addCountry(submitData);
        showToast("Country added successfully!", "success");
      }

      setShowAddForm(false);
      setIsEditing(false);
      fetchCountries();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Country ID (e.g., portugal-d8)"
                value={form.country_id}
                onChange={(e) => handleFieldChange("country_id", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="Country Name"
                value={form.country}
                onChange={(e) => handleFieldChange("country", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="Country Code (e.g., PT)"
                value={form.countryCode}
                onChange={(e) => handleFieldChange("countryCode", e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="Visa Name"
                value={form.visaName}
                onChange={(e) => handleFieldChange("visaName", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <select
                value={form.visaType}
                onChange={(e) => handleFieldChange("visaType", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Residence">Residence</option>
                <option value="Short-stay">Short-stay</option>
                <option value="Temporary residence">Temporary residence</option>
                <option value="Long-term visa">Long-term visa</option>
                <option value="Remote work permit">Remote work permit</option>
              </select>
              <select
                value={form.difficulty}
                onChange={(e) => handleFieldChange("difficulty", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Financial & Duration</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="number" placeholder="Min Income Monthly" value={form.minIncomeMonthly} onChange={(e) => handleFieldChange("minIncomeMonthly", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Min Income Yearly" value={form.minIncomeYearly} onChange={(e) => handleFieldChange("minIncomeYearly", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input placeholder="Currency (e.g., EUR, USD)" value={form.currency} onChange={(e) => handleFieldChange("currency", e.target.value.toUpperCase())} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input placeholder="Currency Symbol (e.g., €, $)" value={form.currencySymbol} onChange={(e) => handleFieldChange("currencySymbol", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Duration (months)" value={form.durationMonths} onChange={(e) => handleFieldChange("durationMonths", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Renewable (years)" value={form.renewableYears} onChange={(e) => handleFieldChange("renewableYears", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Processing (weeks)" value={form.processingWeeks} onChange={(e) => handleFieldChange("processingWeeks", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Cost (USD)" value={form.costUSD} onChange={(e) => handleFieldChange("costUSD", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Cost of Living Index" value={form.costOfLivingIndex} onChange={(e) => handleFieldChange("costOfLivingIndex", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ratings & Location</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Color:</span>
                <input type="color" value={form.color} onChange={(e) => handleFieldChange("color", e.target.value)} className="w-16 h-12 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer" />
              </div>
              <input type="number" step="0.1" placeholder="Safety Rating (0-10)" value={form.safetyRating} onChange={(e) => handleFieldChange("safetyRating", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Internet Speed (Mbps)" value={form.internetSpeed} onChange={(e) => handleFieldChange("internetSpeed", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <select value={form.englishProficiency} onChange={(e) => handleFieldChange("englishProficiency", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                <option value="Low">Low</option>
                <option value="Low to Moderate">Low to Moderate</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Native">Native</option>
              </select>
              <input placeholder="Timezone (e.g., GMT+0, GMT+1)" value={form.timezone} onChange={(e) => handleFieldChange("timezone", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" step="0.1" placeholder="Quality of Life (0-10)" value={form.qualityOfLife} onChange={(e) => handleFieldChange("qualityOfLife", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" step="any" placeholder="Latitude" value={form.coordinates.lat} onChange={(e) => handleCoordinatesChange("lat", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
              <input type="number" step="any" placeholder="Longitude" value={form.coordinates.lng} onChange={(e) => handleCoordinatesChange("lng", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Details & Requirements</h3>

            {[
              { label: "Requirements", field: "requirements", temp: tempRequirement, setTemp: setTempRequirement },
              { label: "Benefits", field: "benefits", temp: tempBenefit, setTemp: setTempBenefit },
              { label: "Restrictions", field: "restrictions", temp: tempRestriction, setTemp: setTempRestriction },
              { label: "Best For", field: "bestFor", temp: tempBestFor, setTemp: setTempBestFor },
            ].map(({ label, field, temp, setTemp }) => (
              <div className="space-y-2" key={field}>
                <label className="text-sm text-slate-400">{label}</label>
                <div className="flex gap-2">
                  <input
                    placeholder={`Add a ${label.toLowerCase()}`}
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray(temp, setTemp, field);
                      }
                    }}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => addToArray(temp, setTemp, field)}
                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {form[field].map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-full text-sm text-white">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFromArray(idx, field)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="text-white">Popular</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-white">Featured</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAddForm}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto form-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Edit Country" : "Add New Country"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setStepError("");
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all cursor-pointer
                        ${index === currentStep
                          ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                          : index < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      onClick={() => {
                        if (index < currentStep) {
                          setCurrentStep(index);
                          setStepError("");
                        } else if (index > currentStep && isStepValid()) {
                          setCurrentStep(index);
                          setStepError("");
                        }
                      }}
                    >
                      {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    <div className={`text-xs mt-2 hidden md:block ${index === currentStep ? "text-blue-400" : "text-slate-500"}`}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 h-1 bg-slate-700 rounded-full w-full"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {stepError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{stepError}</span>
              </div>
            )}

            <div>
              <div className="min-h-[400px]">
                {renderStepContent()}
              </div>

              <div className="flex justify-between gap-3 pt-8 mt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-2 rounded-xl text-white transition-all flex items-center gap-2
                    ${currentStep === 0 ? "bg-slate-700 cursor-not-allowed opacity-50" : "bg-slate-700 hover:bg-slate-600"}`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all flex items-center gap-2"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> {isEditing ? "Update Country" : "Save Country"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredCountries.length === 0 ? (
        <p className="text-gray-400">No countries found</p>
      ) : (
        filteredCountries.map((c) => (
          <div
            key={c._id}
            className="p-4 mb-3 bg-white/5 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-white">{c.country}</p>
              <p className="text-sm text-gray-400">{c.visaName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(c)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Delete Country</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{confirmDelete.country}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCountry(confirmDelete.country_id);
                    showToast("Country deleted successfully!", "success");
                    fetchCountries();
                  } catch (err) {
                    showToast(err.response?.data?.error || "Failed to delete country", "error");
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}