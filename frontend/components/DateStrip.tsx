"use client";

import React, { useRef } from 'react';

interface DateStripProps {
    currentDate: Date;
    onDateSelect: (date: Date) => void;
    prices?: { [date: string]: number }; // Optional: Map of date string (YYYY-MM-DD) to price
}

const DateStrip: React.FC<DateStripProps> = ({ currentDate, onDateSelect, prices }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate +/- 7 days
    const dates = [];
    for (let i = -7; i <= 7; i++) {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getPrice = (date: Date) => {
        if (!prices) return null;
        return prices[formatDate(date)];
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            <button
                onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
                <i className="fa-solid fa-chevron-left text-slate-600 text-xs"></i>
            </button>
            <button
                onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </button>

            {/* Date Container */}
            <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar px-1 py-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {dates.map((date, idx) => {
                    const isSelected = formatDate(date) === formatDate(currentDate);
                    const disabled = isPast(date);
                    const price = getPrice(date);

                    return (
                        <button
                            key={idx}
                            disabled={disabled}
                            onClick={() => onDateSelect(date)}
                            className={`flex-shrink-0 min-w-[100px] h-16 rounded-lg border transition-all flex flex-col justify-center items-center gap-1 scroll-snap-align-start
                                ${isSelected
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105'
                                    : disabled
                                        ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                        : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md text-slate-600'
                                }
                            `}
                        >
                            <span className={`text-xs font-medium ${isSelected ? 'text-white/70' : ''}`}>
                                {date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                            </span>
                            {price ? (
                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{price} €</span>
                            ) : (
                                <span className={`text-[10px] ${isSelected ? 'text-white/50' : 'text-slate-400'}`}>-</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DateStrip;
