import { useEffect, useState } from "react";
import {
  Search,
  Plus,

} from "lucide-react";
import {
  getAllCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from "../../Services/country/countryService";

export default function CountriesTab() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const openAddForm = () => {
    setForm({
      country_id: "",
      country: "",
      countryCode: "",
      visaName: "",
      visaType: "",
      difficulty: "",
      minIncomeMonthly: "",
      minIncomeYearly: "",
      currency: "",
      currencySymbol: "",
      durationMonths: "",
      renewableYears: "",
      processingWeeks: "",
      costUSD: "",
      costOfLivingIndex: "",
      color: "#a855f7",
      safetyRating: "",
      internetSpeed: "",
      englishProficiency: "",
      timezone: "",
      qualityOfLife: "",
      popular: false,
      featured: false,
      coordinates: { lat: "", lng: "" },
    });

    setIsEditing(false);
    setShowAddForm(true);
  };
  const [form, setForm] = useState({
    country_id: "",
    country: "",
    countryCode: "",
    visaName: "",
    visaType: "",
    difficulty: "",
    minIncomeMonthly: "",
    minIncomeYearly: "",
    currency: "",
    currencySymbol: "",
    durationMonths: "",
    renewableYears: "",
    processingWeeks: "",
    costUSD: "",
    costOfLivingIndex: "",
    color: "#a855f7",
    safetyRating: "",
    internetSpeed: "",
    englishProficiency: "",
    timezone: "",
    qualityOfLife: "",
    popular: false,
    featured: false,
    coordinates: {
      lat: "",
      lng: "",
    },
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  const requiredFields = [
    "country_id",
    "country",
    "countryCode",
    "visaName",
    "visaType",
    "difficulty",
    "currency",
    "currencySymbol",
  ];

  // ================= FETCH =================
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await getAllCountries();
      setCountries(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // ================= SEARCH =================
  const filteredCountries = countries.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyField = requiredFields.some((field) => !form[field]);

    if (hasEmptyField) {
      setError("Please fill all fields.");
      return;
    }

    if (!form.coordinates.lat || !form.coordinates.lng) {
      setError("Please enter coordinates.");
      return;
    }

    setError("");

    try {
      if (isEditing) {
        const id = form.country_id || form._id;

        const res = await updateCountry(id, form);

        setCountries((prev) =>
          prev.map((c) =>
            c.country_id === form.country_id ? res.country : c
          )
        );
      } else {
        const res = await addCountry(form);

        setCountries((prev) => [...prev, res.country]);
      }

      setShowAddForm(false);
      setIsEditing(false);

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  // ================= EDIT =================
  const handleEdit = (country) => {
    setForm({
      ...country,
      country_id: country.country_id,
    });

    setIsEditing(true);
    setShowAddForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteCountry(id);

      setCountries((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search countries ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={openAddForm}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Edit Country" : "Add New Country"}
              </h2>
              {error && (
                <div className="m-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
                  {error}
                </div>
              )}
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Country ID"
                value={form.country_id}
                onChange={(e) =>
                  setForm({ ...form, country_id: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                placeholder="Country Name"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                placeholder="Country Code"
                value={form.countryCode}
                onChange={(e) =>
                  setForm({ ...form, countryCode: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                placeholder="Visa Name"
                value={form.visaName}
                onChange={(e) =>
                  setForm({ ...form, visaName: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                placeholder="Visa Type"
                value={form.visaType}
                onChange={(e) =>
                  setForm({ ...form, visaType: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                placeholder="Difficulty"
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">

              <input
                type="number"
                placeholder="Latitude"
                value={form.coordinates.lat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: {
                      ...form.coordinates,
                      lat: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                type="number"
                placeholder="Longitude"
                value={form.coordinates.lng}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: {
                      ...form.coordinates,
                      lng: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>
            <div className="flex gap-4 mt-4">
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
      ${form.popular
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      popular: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="font-medium">Popular</span>
              </label>

              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
      ${form.featured
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="font-medium">Featured</span>
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white"
            >
              {isEditing ? "Update Country" : "Save Country"}
            </button>

          </div>
        </div>
      )}

      {/* ================= LIST ================= */}
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
              <p className="font-bold">{c.country}</p>
              <p className="text-sm text-gray-400">{c.visaName}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="inline-flex items-center justify-center gap-2 px-10 py-1.5 rounded-xl text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-200 active:scale-95"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="inline-flex items-center justify-center gap-2 px-10 py-1.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}