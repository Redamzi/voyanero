"use client";

import React, { useState } from 'react';

interface FilterSidebarProps {
    filters: {
        stops: string | null;
        maxPrice: number | null;
        airlines: string[];
    };
    onFilterChange: (newFilters: FilterSidebarProps['filters']) => void;
    minPrice: number;
    maxPrice: number;
    availableAirlines: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    filters,
    onFilterChange,
    minPrice,
    maxPrice,
    availableAirlines
}) => {
    const [price, setPrice] = useState(filters.maxPrice || maxPrice);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8 sticky top-24">
            {/* Stops Filter */}
            <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    Zwischenstopps
                    <i className="fa-solid fa-route text-slate-400"></i>
                </h3>
                <div className="space-y-3">
                    {['Alle', 'Direkt', 'Max. 1 Stopp', 'Max. 2 Stopps'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filters.stops === option ? 'bg-orange-500 border-orange-500' : 'border-slate-300 bg-white group-hover:border-orange-400'}`}>
                                {filters.stops === option && <i className="fa-solid fa-check text-white text-xs"></i>}
                            </div>
                            <input
                                type="radio"
                                name="stops"
                                value={option}
                                className="hidden"
                                checked={filters.stops === option}
                                onChange={() => onFilterChange({ ...filters, stops: option })}
                            />
                            <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Price Filter */}
            <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    Preis
                    <span className="text-sm font-normal text-slate-500">bis {price} €</span>
                </h3>
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={price}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPrice(val);
                        onFilterChange({ ...filters, maxPrice: val });
                    }}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                    <span>{minPrice} €</span>
                    <span>{maxPrice} €</span>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Baggage Filter */}
            <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    Gepäck
                    <i className="fa-solid fa-suitcase text-slate-400"></i>
                </h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-slate-300 bg-white group-hover:border-orange-400 flex items-center justify-center">
                            {/* Checkbox state logic needed */}
                        </div>
                        <span className="text-slate-700 text-sm font-medium">Nur Handgepäck</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border border-slate-300 bg-white group-hover:border-orange-400 flex items-center justify-center">
                            {/* Checkbox state logic needed */}
                        </div>
                        <span className="text-slate-700 text-sm font-medium">Aufgabegepäck</span>
                    </label>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Airlines Filter */}
            <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    Airlines
                    <i className="fa-solid fa-plane-up text-slate-400"></i>
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                    {availableAirlines.map((airline) => (
                        <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.airlines.includes(airline) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 bg-white'}`}>
                                {filters.airlines.includes(airline) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.airlines.includes(airline)}
                                onChange={() => {
                                    const newAirlines = filters.airlines.includes(airline)
                                        ? filters.airlines.filter(a => a !== airline)
                                        : [...filters.airlines, airline];
                                    onFilterChange({ ...filters, airlines: newAirlines });
                                }}
                            />
                            <div className="flex items-center gap-2">
                                <img src={`http://pics.avs.io/60/60/${airline}.png`} alt={airline} className="w-5 h-5 object-contain" />
                                <span className="text-slate-700 text-sm">{airline}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FilterSidebar;
