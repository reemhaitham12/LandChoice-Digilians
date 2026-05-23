import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faMinus,
    faRotateRight,
    faXmark,
    faDollarSign,
    faClock,
    faSearch,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { useVisa } from "../context/visaContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../Components/Loading";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const crowdedCountries = {
    Portugal: { x: -19, y: 1 },
    Spain: { x: 1, y: -9 },
    Estonia: { x: 0, y: -8 },
    "Czech Republic": { x: 28, y: 2 },
    Croatia: { x: 17, y: 2 },
    Italy: { x: -13, y: 1 },
    Greece: { x: 17, y: 2 },
    Malta: { x: -15, y: 1 },
    Germany: { x: -20, y: 1 },
};

export default function Home() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [position, setPosition] = useState({
        coordinates: [-2, 8],
        zoom: 1,
    });

    const { visaData = [], loading } = useVisa();
    const navigate = useNavigate();

    const { user } = useAuth();

    const protectedNavigate = (path) => {
        if (!user) {
            navigate("/login");
            return;
        }

        navigate(path);
    };
    const countries = Array.isArray(visaData)
        ? visaData
        : Array.isArray(visaData?.countries)
            ? visaData.countries
            : [];

    const visibleCountries = countries.filter(
        (country) =>
            country?.coordinates &&
            typeof country.coordinates.lng === "number" &&
            typeof country.coordinates.lat === "number"
    );

    const filteredCountries = visibleCountries.filter(
        (country) =>
            country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.visaName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const easiestCountries = visibleCountries.filter(
        (country) => country.difficulty === "Easy"
    ).length;

    const minIncome =
        visibleCountries.length > 0
            ? Math.min(...visibleCountries.map((country) => country.minIncomeMonthly))
            : 0;

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24">
            <div className="relative min-h-[calc(100vh-96px)] w-full overflow-x-hidden px-4 pb-6 flex flex-col gap-4 lg:h-[calc(100vh-96px)] lg:overflow-hidden lg:flex-row lg:items-center lg:justify-center">

                {/* Map Card */}
                <div className="relative w-full h-[420px] rounded-3xl border border-white/10 bg-slate-900/40 overflow-hidden shadow-2xl lg:h-full lg:flex-1">
                    {/* Zoom Buttons */}
                    <div className="absolute z-20 flex gap-2 top-4 right-4 lg:flex-col lg:top-1/2 lg:-translate-y-1/2">
                        <button
                            onClick={() =>
                                setPosition((pos) => ({
                                    ...pos,
                                    zoom: pos.zoom + 0.5,
                                }))
                            }
                            className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-200 text-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-blue-500/30 transition-all flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>

                        <button
                            onClick={() =>
                                setPosition((pos) => ({
                                    ...pos,
                                    zoom: Math.max(1, pos.zoom - 0.5),
                                }))
                            }
                            className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-200 text-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-blue-500/30 transition-all flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>

                        <button
                            onClick={() =>
                                setPosition({
                                    coordinates: [10, 10],
                                    zoom: 1,
                                })
                            }
                            className="w-11 h-11 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 text-base shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-500/30 transition-all flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                    </div>

                    <ComposableMap
                        width={800}
                        height={600}
                        projectionConfig={{ scale: 150 }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ZoomableGroup
                            zoom={position.zoom}
                            center={position.coordinates}
                            onMoveEnd={(position) => setPosition(position)}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const geoName = geo.properties.name;

                                        const matchedCountry = visibleCountries.find(
                                            (country) =>
                                                country.country === geoName ||
                                                country.countryCode === geo.properties.ISO_A2
                                        );

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onClick={() => {
                                                    if (matchedCountry) {
                                                        setSelectedCountry(matchedCountry);
                                                    }
                                                }}
                                                style={{
                                                    default: {
                                                        fill: matchedCountry
                                                            ? matchedCountry.color || "#3b82f6"
                                                            : "#1e293b",
                                                        stroke: "#334155",
                                                        strokeWidth: 0.5,
                                                        outline: "none",
                                                        cursor: matchedCountry ? "pointer" : "default",
                                                        opacity: matchedCountry ? 0.65 : 1,
                                                    },
                                                    hover: {
                                                        fill: matchedCountry
                                                            ? matchedCountry.color || "#3b82f6"
                                                            : "#334155",
                                                        stroke: "#ffffff",
                                                        strokeWidth: matchedCountry ? 1 : 0.7,
                                                        outline: "none",
                                                        cursor: matchedCountry ? "pointer" : "default",
                                                        opacity: 0.95,
                                                    },
                                                    pressed: {
                                                        fill: matchedCountry
                                                            ? matchedCountry.color || "#3b82f6"
                                                            : "#475569",
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>

                            {visibleCountries.map((country) => {
                                const countryId =
                                    country.id || country.country_id || country._id;

                                return (
                                    <Marker
                                        key={countryId}
                                        coordinates={[
                                            country.coordinates.lng,
                                            country.coordinates.lat,
                                        ]}
                                    >
                                        <g
                                            onClick={() => setSelectedCountry(country)}
                                            className="cursor-pointer"
                                        >
                                            <circle
                                                r={5.5}
                                                fill={country.color || "#3b82f6"}
                                                opacity={0.12}
                                            />

                                            <circle
                                                r={2.8}
                                                fill={country.color || "#3b82f6"}
                                                stroke="#ffffff"
                                                strokeWidth={0.8}
                                            />

                                            <text
                                                x={crowdedCountries[country.country]?.x || 0}
                                                y={crowdedCountries[country.country]?.y || -12}
                                                textAnchor="middle"
                                                fill="#f8fafc"
                                                fontSize={6.5}
                                                fontWeight="700"
                                                stroke="#020617"
                                                strokeWidth={2.2}
                                                paintOrder="stroke"
                                                className="cursor-pointer select-none"
                                            >
                                                {country.country}
                                            </text>
                                        </g>
                                    </Marker>
                                );
                            })}
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Desktop hint */}
                    <div className="absolute bottom-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-xs shadow-2xl hidden lg:block">
                        <h4 className="text-white font-bold text-sm mb-3">
                            🌍 Interactive Map
                        </h4>

                        <ul className="space-y-2 text-xs text-slate-300">
                            <li className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span>Colored countries = Visa programs available</span>
                            </li>

                            <li className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <span>Gray countries = No programs yet</span>
                            </li>

                            <li className="text-slate-400 mt-2">
                                Click any colored country or marker to view details
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Search / Stats Card */}
                <div className="z-20 w-full lg:absolute lg:top-4 lg:left-6 lg:w-80">
                    <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-4 shadow-2xl backdrop-blur-md">
                        <div className="relative mb-4">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search country or visa..."
                                className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-11 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400/50"
                            />

                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            )}
                        </div>

                        {searchQuery && filteredCountries.length > 0 && (
                            <div className="mb-4 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/80">
                                {filteredCountries.map((country) => (
                                    <button
                                        key={country.id || country.country_id || country._id}
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setSearchQuery("");
                                        }}
                                        className="w-full p-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-white font-semibold text-sm">
                                                    {country.country}
                                                </div>
                                                <div className="text-slate-400 text-xs">
                                                    {country.visaName}
                                                </div>
                                            </div>

                                            <div
                                                className="w-3 h-3 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: country.color || "#3b82f6",
                                                }}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchQuery && filteredCountries.length === 0 && (
                            <div className="mb-4 rounded-2xl bg-white/5 p-3 text-sm text-slate-400">
                                No countries found
                            </div>
                        )}

                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Available Programs
                        </h3>

                        <div className="mt-2 text-white text-3xl font-bold">
                            {visibleCountries.length}
                        </div>

                        <p className="text-slate-400 text-xs">
                            Countries with digital nomad visas
                        </p>

                        <div className="pt-4 mt-4 border-t border-white/10">
                            <div className="text-xs text-slate-400 mb-2">
                                Quick Stats
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Easiest:</span>
                                    <span className="text-green-400 font-medium">
                                        {easiestCountries} countries
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">From:</span>
                                    <span className="text-white font-medium">
                                        ${minIncome}/mo
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedCountry && (
                    <>
                        <div
                            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedCountry(null)}
                        />

                        <div className="fixed top-1/2 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl overflow-hidden">
                            <div
                                className="absolute top-0 left-0 right-0 h-1.5"
                                style={{
                                    backgroundColor: selectedCountry.color || "#3b82f6",
                                }}
                            />

                            <button
                                onClick={() => setSelectedCountry(null)}
                                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>

                            <h2 className="pr-10 text-3xl font-bold text-white">
                                {selectedCountry.country}
                            </h2>

                            <p
                                className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                                style={{
                                    backgroundColor: `${selectedCountry.color || "#3b82f6"}22`,
                                    color: selectedCountry.color || "#3b82f6",
                                    border: `1px solid ${selectedCountry.color || "#3b82f6"}55`,
                                }}
                            >
                                {selectedCountry.visaName}
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <FontAwesomeIcon icon={faDollarSign} />
                                        Income
                                    </div>
                                    <p className="font-bold text-white">
                                        {selectedCountry.currencySymbol}
                                        {selectedCountry.minIncomeMonthly}/mo
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <FontAwesomeIcon icon={faClock} />
                                        Duration
                                    </div>
                                    <p className="font-bold text-white">
                                        {selectedCountry.durationMonths} months
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                                    <p className="text-xs text-slate-400 mb-1">
                                        Difficulty
                                    </p>
                                    <p
                                        className={`font-bold ${selectedCountry.difficulty === "Easy"
                                            ? "text-green-400"
                                            : selectedCountry.difficulty === "Medium"
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                            }`}
                                    >
                                        {selectedCountry.difficulty}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                                    <p className="text-xs text-slate-400 mb-1">
                                        Processing
                                    </p>
                                    <p className="font-bold text-white">
                                        {selectedCountry.processingWeeks} weeks
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-3">
                                <button
                                    onClick={() =>
                                        protectedNavigate(`/country/${selectedCountry.id || selectedCountry.country_id || selectedCountry._id}`)
                                    }
                                    className="w-full py-3 rounded-2xl font-bold text-white transition-all hover:scale-[1.01]"
                                    style={{
                                        background: `linear-gradient(135deg, ${selectedCountry.color || "#3b82f6"
                                            }cc, ${selectedCountry.color || "#3b82f6"}88)`,
                                        border: `1px solid ${selectedCountry.color || "#3b82f6"
                                            }55`,
                                    }}
                                >
                                    View Country Details
                                </button>

                                <button
                                    onClick={() =>
                                        protectedNavigate(`/compare?add=${selectedCountry.id || selectedCountry.country_id || selectedCountry._id}`)
                                    }
                                    className="w-full py-3 rounded-2xl font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-all"
                                >
                                    Add to Compare
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}