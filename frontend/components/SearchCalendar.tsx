import React, { useState } from 'react';

interface SearchCalendarProps {
    checkIn: Date | null;
    checkOut: Date | null;
    onChange: (checkIn: Date | null, checkOut: Date | null) => void;
    onClose: () => void;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const SearchCalendar: React.FC<SearchCalendarProps> = ({ checkIn, checkOut, onChange, onClose }) => {
    // Start showing from current month
    const [viewDate, setViewDate] = useState(new Date());

    // Mock prices for visual parity with screenshot
    const getPriceForDay = (day: number, month: number) => {
        // Deterministic pseudo-random price
        const seed = day * 100 + month;
        const price = 40 + (seed % 200);
        return price > 180 ? null : price; // Only show some prices
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const renderMonth = (baseDate: Date) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // Sunday is 0
        // Adjust for Monday start (0=Mon, 6=Sun)
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < startOffset; i++) days.push(<div key={`empty-${i}`} />);

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            // Reset time part for safe comparison
            // Disable past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = date < today;

            const isSelectedCheckIn = checkIn && date.getTime() === checkIn.getTime();
            const isSelectedCheckOut = checkOut && date.getTime() === checkOut.getTime();
            const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;
            const isSelected = isSelectedCheckIn || isSelectedCheckOut;

            // Mock Price
            const price = getPriceForDay(d, month);
            const isGreen = price && price < 80;

            days.push(
                <button
                    key={d}
                    disabled={isPast}
                    onClick={() => {
                        if (isPast) return;
                        const clickedTime = date.getTime();
                        if (!checkIn || (checkIn && checkOut)) {
                            // Start new selection
                            onChange(date, null);
                        } else {
                            if (clickedTime > checkIn.getTime()) {
                                // Close range
                                onChange(checkIn, date);
                            } else {
                                // Reset start
                                onChange(date, null);
                            }
                        }
                    }}
                    className={`
                        relative h-10 md:h-14 w-full flex flex-col items-center justify-center rounded-lg transition-all
                        ${isPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}
                        ${isSelected ? 'bg-slate-900 text-white z-10 !opacity-100 !cursor-pointer' : ''}
                        ${isInRange ? 'bg-slate-100' : ''}
                    `}
                >
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{d}</span>
                    {price && !isSelected && !isInRange && !isPast && (
                        <span className={`text-[10px] font-medium mt-[-2px] ${isGreen ? 'text-green-600' : 'text-slate-400'}`}>
                            {price} €
                        </span>
                    )}
                </button>
            );
        }

        return (
            <div className="flex-1 min-w-[300px]">
                <div className="text-center mb-6 font-bold text-slate-900 capitalize bg-slate-50 py-2 rounded-lg">
                    {baseDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="text-xs font-bold text-slate-400 uppercase">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    const nextMonthDate = new Date(viewDate);
    nextMonthDate.setMonth(viewDate.getMonth() + 1);

    return (
        <div className="w-full bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100">
            {/* Header Options */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Hinreise Input */}
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-900 mb-2">Hinreise</label>
                    <div className="relative group">
                        <div className="flex items-center gap-3 w-full p-4 border-2 border-blue-500 rounded-xl bg-white shadow-sm">
                            <i className="fa-regular fa-calendar text-blue-500"></i>
                            <span className="font-bold text-slate-900">
                                {checkIn ? checkIn.toLocaleDateString('de-DE') : 'Datum auswählen'}
                            </span>
                        </div>
                        {/* Flexibility Pills */}
                        <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 1 Tag</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 3 Tage</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 5 Tage</button>
                        </div>
                    </div>
                </div>

                {/* Rückreise Input */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-900">Rückreise</label>
                        <span className="text-xs font-bold text-slate-400">Aufenthaltsdauer</span>
                    </div>
                    <div className="relative group">
                        <div className={`flex items-center gap-3 w-full p-4 border-2 ${checkOut ? 'border-slate-900' : 'border-slate-200'} rounded-xl bg-white shadow-sm`}>
                            <i className="fa-regular fa-calendar text-slate-400"></i>
                            <span className={`font-bold ${checkOut ? 'text-slate-900' : 'text-slate-400'}`}>
                                {checkOut ? checkOut.toLocaleDateString('de-DE') : 'Irgendwann'}
                            </span>
                        </div>
                        {/* Flexibility Pills for Return */}
                        <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 1 Tag</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 3 Tage</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 5 Tage</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation & Calendar Grid */}
            <div className="relative flex gap-8 items-start justify-center">
                <button onClick={handlePrevMonth} className="absolute left-0 top-6 -ml-2 md:-ml-4 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 z-20">
                    <i className="fa-solid fa-chevron-left text-xs md:text-sm text-slate-600"></i>
                </button>

                {renderMonth(viewDate)}
                <div className="hidden md:block w-px bg-slate-100 self-stretch mx-4"></div>
                <div className="hidden md:block">
                    {renderMonth(nextMonthDate)}
                </div>

                <button onClick={handleNextMonth} className="absolute right-0 top-6 -mr-2 md:-mr-4 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center hover:bg-slate-50 z-20">
                    <i className="fa-solid fa-chevron-right text-xs md:text-sm text-slate-600"></i>
                </button>
            </div>

            {/* Footer Actions */}

        </div>
    );
};
