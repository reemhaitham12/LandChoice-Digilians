import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";

import visaData from "../data/visaData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function Home() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [zoom, setZoom] = useState(1);

    return (
        <div className="h-screen bg-slate-950 text-white pt-24">

            {/* Map takes the full available page */}
            <div className="relative h-[calc(100vh-96px)] w-full overflow-hidden">

                {/* Zoom buttons */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <button
                        onClick={() => setZoom(zoom + 0.5)}
                        className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 text-white text-xl"
                    >
                        +
                    </button>

                    <button
                        onClick={() => setZoom(Math.max(1, zoom - 0.5))}
                        className="w-10 h-10 rounded-lg bg-slate-900 border border-white/10 text-white text-xl"
                    >
                        -
                    </button>
                </div>

                {/* World map */}
                <ComposableMap
                    projectionConfig={{
                        scale: 150,
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <ZoomableGroup zoom={zoom} center={[10, 35]}>
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

                        {/* Dots for countries from visaData */}
                        {visaData.map((country) => (
                            <Marker
                                key={country.id}
                                coordinates={[
                                    country.coordinates.lng,
                                    country.coordinates.lat,
                                ]}
                            >
                                <g
                                    onClick={() => setSelectedCountry(country)}
                                    className="cursor-pointer"
                                >
                                    {/* Outer glowing circle */}
                                    <circle
                                        r={6}
                                        fill={country.color}
                                        opacity={0.18}
                                        className="pointer-events-none"
                                    />
                                    {/* Main dot */}
                                    <circle
                                        r={3}
                                        fill={country.color}
                                        stroke="#ffffff"
                                        strokeWidth={0.8}
                                    />

                                    {/* Country name */}
                                    <text
                                        y={-10}
                                        textAnchor="middle"
                                        fill="#f8fafc"
                                        fontSize={6.5}
                                        fontWeight="700"
                                        stroke="#020617"
                                        strokeWidth={2.2}
                                        paintOrder="stroke"
                                        className="pointer-events-none select-none"
                                    >
                                        {country.country}
                                    </text>
                                </g>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>

                {/* Popup */}
                {selectedCountry && (
                    <>
                        <div
                            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedCountry(null)}
                        />

                        <div className="absolute top-1/2 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl">

                            <button
                                onClick={() => setSelectedCountry(null)}
                                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                            >
                                ×
                            </button>

                            <div
                                className="mb-4 h-1.5 w-20 rounded-full"
                                style={{ backgroundColor: selectedCountry.color }}
                            />

                            <h2 className="pr-10 text-2xl font-bold text-white">
                                {selectedCountry.country}
                            </h2>

                            <p
                                className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                                style={{
                                    backgroundColor: `${selectedCountry.color}22`,
                                    color: selectedCountry.color,
                                    border: `1px solid ${selectedCountry.color}55`,
                                }}
                            >
                                {selectedCountry.visaName}
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                                    <p className="text-xs text-slate-400">Income</p>
                                    <p className="mt-1 font-bold text-white">
                                        {selectedCountry.currencySymbol}
                                        {selectedCountry.minIncomeMonthly}/mo
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                                    <p className="text-xs text-slate-400">Duration</p>
                                    <p className="mt-1 font-bold text-white">
                                        {selectedCountry.durationMonths} months
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                                    <p className="text-xs text-slate-400">Difficulty</p>
                                    <p className="mt-1 font-bold text-white">
                                        {selectedCountry.difficulty}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
                                    <p className="text-xs text-slate-400">Processing</p>
                                    <p className="mt-1 font-bold text-white">
                                        {selectedCountry.processingWeeks} weeks
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}