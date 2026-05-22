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
    faEarthAfrica,
    faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";

import { useVisa } from "../context/visaContext";

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
    const [zoom, setZoom] = useState(1);

    const { visaData = [], loading } = useVisa();
    const navigate = useNavigate();

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

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 text-white pt-24">
            <div className="relative h-[calc(100vh-96px)] w-full overflow-hidden flex items-center justify-center px-4">
                <div className="absolute z-20 flex flex-col gap-3 top-4 left-4 lg:left-auto lg:right-6 lg:top-1/2 lg:-translate-y-1/2">
                    <button
                        onClick={() => setZoom(zoom + 0.5)}
                        className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-200 text-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-blue-500/30 transition-all flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <button
                        onClick={() => setZoom(Math.max(1, zoom - 0.5))}
                        className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-200 text-lg shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:bg-blue-500/30 transition-all flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>

                    <button
                        onClick={() => setZoom(1)}
                        className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 text-base shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-yellow-500/30 transition-all flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                </div>

                <ComposableMap
                    projectionConfig={{ scale: 150 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ZoomableGroup zoom={zoom} center={[10, 10]}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: {
                                                fill: "#1e293b",
                                                stroke: "#334155",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#334155",
                                                stroke: "#64748b",
                                                strokeWidth: 0.7,
                                                outline: "none",
                                            },
                                            pressed: {
                                                fill: "#475569",
                                                outline: "none",
                                            },
                                        }}
                                    />
                                ))
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
                                            r={8}
                                            fill={country.color || "#3b82f6"}
                                            opacity={0.2}
                                        />

                                        <circle
                                            r={4}
                                            fill={country.color || "#3b82f6"}
                                            stroke="#ffffff"
                                            strokeWidth={1}
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

                {selectedCountry && (
                    <>
                        <div
                            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedCountry(null)}
                        />

                        <div className="absolute top-1/2 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl overflow-hidden">
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
                                        className={`font-bold ${
                                            selectedCountry.difficulty === "Easy"
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
                                        navigate(
                                            `/country/${
                                                selectedCountry.id ||
                                                selectedCountry.country_id ||
                                                selectedCountry._id
                                            }`
                                        )
                                    }
                                    className="w-full py-3 rounded-2xl font-bold text-white transition-all hover:scale-[1.01]"
                                    style={{
                                        background: `linear-gradient(135deg, ${
                                            selectedCountry.color || "#3b82f6"
                                        }cc, ${selectedCountry.color || "#3b82f6"}88)`,
                                        border: `1px solid ${
                                            selectedCountry.color || "#3b82f6"
                                        }55`,
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faEarthAfrica}
                                        className="mr-2"
                                    />
                                    View Country Details
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/compare?add=${
                                                selectedCountry.id ||
                                                selectedCountry.country_id ||
                                                selectedCountry._id
                                            }`
                                        )
                                    }
                                    className="w-full py-3 rounded-2xl font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-all"
                                >
                                    <FontAwesomeIcon
                                        icon={faScaleBalanced}
                                        className="mr-2"
                                    />
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