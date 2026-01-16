import React, { useState } from 'react';
import { FlightService } from '../services/api';

interface SearchCalendarProps {
    checkIn: Date | null;
    checkOut: Date | null;
    onChange: (checkIn: Date | null, checkOut: Date | null) => void;
    onClose: () => void;
    origin?: string;
    destination?: string;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export const SearchCalendar: React.FC<SearchCalendarProps> = ({ checkIn, checkOut, onChange, origin, destination }) => {
    // Start showing from current month
    const [viewDate, setViewDate] = useState(new Date());
    const [activeInput, setActiveInput] = useState<'start' | 'end'>('start');
    const [prices, setPrices] = useState<{ [key: string]: number }>({});

    // Fetch prices when origin/destination change
    React.useEffect(() => {
        const fetchPrices = async () => {
            if (origin && destination) {
                try {
                    const dates = await FlightService.getFlightDates({
                        origin,
                        destination
                    });

                    // Transform array to map: "2026-01-16" -> 120
                    const priceMap: { [key: string]: number } = {};
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    dates.forEach((d: any) => {
                        if (d.price && d.departureDate) {
                            priceMap[d.departureDate] = parseFloat(d.price.total);
                        }
                    });
                    setPrices(priceMap);
                } catch (e) {
                    console.error("Failed to load calendar prices", e);
                }
            }
        };

        const timeout = setTimeout(fetchPrices, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [origin, destination]);

    const getPriceForDay = (day: number, month: number, year: number) => {
        const dateStr = new Date(year, month, day, 12).toISOString().split('T')[0];
        return prices[dateStr] || null;
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

            // Mock Price (Now Real Price Lookup)
            const price = getPriceForDay(d, month, year);
            const isGreen = price && price < 80;

            days.push(
                <button
                    key={d}
                    disabled={isPast}
                    onClick={() => {
                        if (isPast) return;

                        // Smart Selection Logic based on Active Input
                        if (activeInput === 'start') {
                            // Setting Start Date
                            if (checkOut && date > checkOut) {
                                onChange(date, null);
                            } else {
                                onChange(date, checkOut);
                            }
                            setActiveInput('end'); // Auto-switch to end selection
                        } else {
                            // Setting End Date
                            if (date < checkIn!) {
                                onChange(date, null);
                                setActiveInput('end');
                            } else {
                                onChange(checkIn, date);
                            }
                        }
                    }}
                    className={`
                        relative h-10 md:h-14 w-full flex flex-col items-center justify-center rounded-lg transition-all
                        ${isPast ? 'opacity-20 cursor-not-allowed' : 'hover:bg-orange-50 text-slate-700'}
                        ${isSelected ? 'bg-slate-900 text-white z-10 !opacity-100 !cursor-pointer' : ''}
                        ${isInRange ? 'bg-orange-50' : ''}
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
        <div className="w-full bg-white rounded-2xl md:rounded-3xl p-4 md:p-6">
            {/* Header Options */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Hinreise Input */}
                <div className="flex-1 cursor-pointer" onClick={() => setActiveInput('start')}>
                    <label className={`block text-xs font-bold mb-2 transition-colors ${activeInput === 'start' ? 'text-orange-600' : 'text-slate-900'}`}>Hinreise</label>

                    <div className="relative group">
                        <div className={`flex items-center gap-3 w-full p-4 border-2 rounded-xl bg-white transition-all ${activeInput === 'start' ? 'border-orange-500 shadow-md ring-4 ring-orange-500/10' : 'border-slate-100 hover:border-slate-300'}`}>
                            <i className={`fa-regular fa-calendar ${activeInput === 'start' ? 'text-orange-500' : 'text-slate-400'}`}></i>
                            <span className="font-bold text-slate-900">
                                {checkIn ? checkIn.toLocaleDateString('de-DE') : 'Datum auswählen'}
                            </span>
                        </div>
                        {/* Flexibility Pills */}
                        <div className="flex gap-2 mt-3 opacity-50 pointer-events-none grayscale">
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 1 Tag</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 3 Tage</button>
                            <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-colors">± 5 Tage</button>
                        </div>
                    </div>
                </div>

                {/* Rückreise Input */}
                <div className="flex-1 cursor-pointer" onClick={() => setActiveInput('end')}>
                    <div className="flex justify-between items-center mb-2">
                        <label className={`block text-xs font-bold transition-colors ${activeInput === 'end' ? 'text-orange-600' : 'text-slate-900'}`}>Rückreise</label>
                        <span className="text-xs font-bold text-slate-400">Aufenthaltsdauer</span>
                    </div>
                    <div className="relative group">
                        <div className={`flex items-center gap-3 w-full p-4 border-2 rounded-xl bg-white transition-all ${activeInput === 'end' ? 'border-orange-500 shadow-md ring-4 ring-orange-500/10' : 'border-slate-100 hover:border-slate-300'}`}>
                            <i className={`fa-regular fa-calendar ${activeInput === 'end' ? 'text-orange-500' : 'text-slate-400'}`}></i>
                            <span className={`font-bold ${checkOut ? 'text-slate-900' : 'text-slate-400'}`}>
                                {checkOut ? checkOut.toLocaleDateString('de-DE') : 'Irgendwann'}
                            </span>
                        </div>
                        {/* Flexibility Pills for Return */}
                        <div className="flex gap-2 mt-3 opacity-50 pointer-events-none grayscale">
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
                <div className="hidden md:block flex-1">
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
