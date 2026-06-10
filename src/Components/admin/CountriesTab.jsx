import { useEffect, useState } from "react";
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

  const [form, setForm] = useState({
    _id: null,
    country: "",
    visaName: "",
  });

  const [isEditing, setIsEditing] = useState(false);

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

    try {
      if (isEditing) {
        const res = await updateCountry(form._id, form);

        setCountries((prev) =>
          prev.map((c) => (c._id === form._id ? res.country : c))
        );
      } else {
        const res = await addCountry(form);
        setCountries((prev) => [...prev, res.country]);
      }

      setForm({ _id: null, country: "", visaName: "" });
      setIsEditing(false);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ================= EDIT =================
  const handleEdit = (country) => {
    setForm(country);
    setIsEditing(true);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Countries</h2>

        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded bg-gray-800 text-white"
        />
      </div>

      {/* ================= FORM ================= */}
      <form
  onSubmit={handleSubmit}
  className="mb-6 w-full bg-white/5 p-4 rounded-xl border border-white/10"
>
  <div className="flex flex-col md:flex-row gap-3">
    {/* Country Input */}
    <input
      type="text"
      placeholder="Country name"
      value={form.country}
      onChange={(e) => setForm({ ...form, country: e.target.value })}
      className="flex-1 px-3 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    {/* Visa Input */}
    <input
      type="text"
      placeholder="Visa name"
      value={form.visaName}
      onChange={(e) => setForm({ ...form, visaName: e.target.value })}
      className="flex-1 px-3 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Buttons */}
    <div className="flex gap-2">
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition w-full md:w-auto"
      >
        {isEditing ? "Update" : "Add"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={() => {
            setForm({ _id: null, country: "", visaName: "" });
            setIsEditing(false);
          }}
          className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-700 transition w-full md:w-auto"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
</form>

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
                className="px-3 py-1 bg-yellow-600 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="px-3 py-1 bg-red-600 rounded"
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