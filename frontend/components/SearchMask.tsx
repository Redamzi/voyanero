"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getStepsForFilter } from '../utils/searchSteps';
import { SearchCalendar } from './SearchCalendar';

import { FlightService } from '../services/api';

interface SearchMaskProps {
    variant?: 'hero' | 'default' | 'compact';
    initialLocation?: string;
    onClose?: () => void;
    isOpen?: boolean;
}

const LocationAutocomplete = ({ value, onChange, onSelect, placeholder, icon, autoFocus, onEnter }: {
    value: string;
    onChange: (val: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelect?: (loc: any) => void;
    placeholder: string;
    icon: string;
    autoFocus?: boolean;
    onEnter?: () => void;
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length > 1) {
                setIsLoading(true);
                // Debounce is handled by setTimeout wrapper
                const results = await FlightService.searchLocations(value);
                setSuggestions(results);
                setIsLoading(false);
                setShowSuggestions(true);
            } else {
                // Default functionality for empty input - Suggest Current Location
                setSuggestions([{ isCurrentLocation: true, iataCode: '📍', name: 'Mein Standort' }]);
            }
        };
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [value]);

    return (
        <div className="relative group w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                <i className={`fa-solid ${icon} text-xl`}></i>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-16 sm:h-20 pl-14 sm:pl-16 pr-6 rounded-full border-2 border-orange-100 bg-white shadow-[0_8px_30px_rgba(234,88,12,0.06)] text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-[#FF385C]/10 placeholder:text-slate-300 transition-all font-jakarta"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoFocus={autoFocus}
                onKeyDown={(e) => e.key === 'Enter' && onEnter && onEnter()}
            />
            {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500">
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-[2rem] mt-2 z-50 max-h-60 overflow-y-auto border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2">
                    {suggestions.map((loc, index) => (
                        <div
                            key={loc.id || index}
                            className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors"
                            onClick={() => {
                                // If it's Mein Standort, we set the text to "Mein Standort" which the backend handles (maps to FRA/MUC or nearest)
                                // Or ideally we would use Geolocation API here, but for MVP keeping it simple as per previous logic
                                onChange(loc.name);
                                if (onSelect) onSelect(loc);
                                setShowSuggestions(false);
                            }}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${loc.isCurrentLocation ? 'bg-slate-100 text-slate-900' : 'bg-orange-50 text-orange-600'}`}>
                                {loc.isCurrentLocation ? <i className="fa-solid fa-location-crosshairs"></i> : loc.iataCode}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-slate-900 text-sm">{loc.address?.cityName || loc.name}</span>
                                {loc.subType && <span className="text-xs text-slate-500 truncate max-w-[200px]">{loc.name}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DESTINATIONS = [
    { name: "Bali, Indonesia", icon: "fa-umbrella-beach", label: "Bali" },
    { name: "Berlin, Germany", icon: "fa-city", label: "Berlin" },
    { name: "Rome, Italy", icon: "fa-monument", label: "Rome" },
    { name: "Paris, France", icon: "fa-archway", label: "Paris" },
    { name: "Tokyo, Japan", icon: "fa-torii-gate", label: "Tokyo" },
    { name: "Bangkok, Thailand", icon: "fa-temple-buddhist", label: "Bangkok" },
    { name: "Istanbul, Turkey", icon: "fa-mosque", label: "Istanbul" }
];

const SearchMask: React.FC<SearchMaskProps> = ({ variant = 'default', initialLocation = "", onClose, isOpen: isOpenProp }) => {
    const router = useRouter();

    // Animation Variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
    };

    const modalVariants = {
        hidden: { y: "100%" },
        visible: {
            y: "0%",
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8
            } as const
        },
        exit: {
            y: "100%",
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 300
            } as const
        }
    };
    const [isOpen, setIsOpen] = useState(isOpenProp ?? false);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    const [location, setLocation] = useState(initialLocation);
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);

    // Guest State
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [pets, setPets] = useState(0);

    // Derived total for display (usually Adults + Children)
    const guests = adults + children;
    const [isLocating, setIsLocating] = useState(false);

    // Search Type Filter (Reisen/Flüge/Unterkünfte/Transfer)
    const [searchType, setSearchType] = useState<'reisen' | 'fluege' | 'unterkunft' | 'transfer'>('reisen');

    // Flight-specific states
    const [flightOrigin, setFlightOrigin] = useState('');
    const [flightDestination, setFlightDestination] = useState('');
    const [flightOriginCode, setFlightOriginCode] = useState('');
    const [flightDestinationCode, setFlightDestinationCode] = useState('');
    const [flightType, setFlightType] = useState<'roundtrip' | 'oneway' | 'multicity'>('roundtrip');

    // Transfer-specific states
    const [transferType, setTransferType] = useState<'oneway' | 'roundtrip'>('oneway');
    const [transferOrigin, setTransferOrigin] = useState('');
    const [transferDestination, setTransferDestination] = useState('');

    // Filter "bestätigen" visibility
    const showConfirm = location.length > 0;

    const handleSearch = () => {
        setIsOpen(false);
        onClose?.();
        // Format date as YYYY-MM-DD for API
        const formatDate = (d: Date | null) => d ? d.toISOString().split('T')[0] : "";

        // Determine location/origin/destination based on searchType
        let finalLocation = location;
        let finalOrigin = "";
        let finalDestination = "";

        if (searchType === 'fluege') {
            finalOrigin = flightOriginCode || flightOrigin;
            finalDestination = flightDestinationCode || flightDestination;
            finalLocation = `${flightOrigin} nach ${flightDestination}`; // Fallback content for generic display
        } else if (searchType === 'transfer') {
            finalOrigin = transferOrigin;
            finalDestination = transferDestination;
            finalLocation = `${transferOrigin} nach ${transferDestination}`;
        }

        const params = new URLSearchParams({
            type: searchType,
            location: finalLocation,
            origin: finalOrigin,
            destination: finalDestination,
            flightType,
            transferType,
            checkIn: formatDate(checkIn),
            checkOut: formatDate(checkOut),
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString(),
            pets: pets.toString()
        });
        router.push(`/search?${params.toString()}`);
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        setTimeout(() => {
            setLocation("Mein Standort");
            setIsLocating(false);
        }, 1000);
    };

    // Calendar Logic
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // Jan 2026 as in screenshot
    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // Sunday is 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Adjust for Monday start if needed, but JS getDay() is Sun=0. Screenshot looks like Sun header maybe?
        // Let's assume standard grid.
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isSelected = (checkIn && date.toDateString() === checkIn.toDateString()) ||
                (checkOut && date.toDateString() === checkOut.toDateString());
            const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;

            days.push(
                <button
                    key={d}
                    onClick={() => {
                        if (!checkIn || (checkIn && checkOut)) {
                            setCheckIn(date);
                            setCheckOut(null);
                        } else if (date > checkIn) {
                            setCheckOut(date);
                        }
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected ? 'bg-black text-white' : ''}
                        ${isInRange ? 'bg-slate-100' : ''}
                        ${!isSelected && !isInRange ? 'hover:bg-slate-100 text-slate-700' : ''}
                    `}
                >
                    {d}
                </button>
            );
        }

        return (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-full">
                        <i className="fa-solid fa-chevron-left text-slate-400 text-xs"></i>
                    </button>
                    <span className="font-black text-slate-900 uppercase tracking-widest text-xs">
                        {currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-full">
                        <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
                    {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((d, i) => (
                        <div key={i} className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{d}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        if (variant !== 'hero') return;

        const handleScroll = () => {
            const threshold = 660; // Approximate hero height
            setIsSticky(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const isCompact = variant === 'compact' || (variant === 'hero' && isSticky);

    const getDateLabels = () => {
        switch (searchType) {
            case 'fluege': return { start: 'Hinflug', end: 'Rückflug', label: 'Reisedaten' };
            case 'unterkunft': return { start: 'Check-in', end: 'Check-out', label: 'Aufenthalt' };
            case 'transfer': return { start: 'Abholung', end: 'Rückfahrt', label: 'Datum' };
            default: return { start: 'Anreise', end: 'Abreise', label: 'Reisezeitraum' };
        }
    };
    const dateLabels = getDateLabels();

    return (
        <>
            {/* --- CLOSED STATE (Floating Bar) --- */}
            <div
                className={`transition-all duration-300 ease-in-out ${isCompact
                    ? 'w-full max-w-2xl mx-auto bg-white rounded-full shadow-md border border-slate-200 p-2 pl-6 flex items-center justify-between cursor-pointer hover:shadow-lg'
                    : 'bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2 pl-8 flex items-center justify-between max-w-3xl w-full mx-auto cursor-pointer hover:shadow-2xl hover:scale-[1.01] group'
                    }`}
                onClick={() => setIsOpen(true)}
            >
                {isCompact ? (
                    // Compact View (Styled like Image 0)
                    <div className="flex items-center w-full h-full">
                        {/* Location */}
                        <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-0 cursor-pointer hover:bg-slate-50 transition-colors rounded-full">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xs shrink-0">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Wohin?</span>
                                <span className="text-sm font-medium text-slate-500 truncate">{location || "Ziele suchen"}</span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-200 shrink-0"></div>

                        {/* Date */}
                        <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-0 cursor-pointer hover:bg-slate-50 transition-colors rounded-full hidden sm:flex">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xs shrink-0">
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Wann?</span>
                                <span className="text-sm font-medium text-slate-500 truncate">
                                    {checkIn ? checkIn.toLocaleDateString('de-DE') : "Beliebige Woche"}
                                </span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-slate-200 shrink-0 hidden sm:block"></div>

                        {/* Guests */}
                        <div className="flex items-center gap-3 px-4 py-2 flex-1 min-w-0 cursor-pointer hover:bg-slate-50 transition-colors rounded-full hidden md:flex">
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-xs shrink-0">
                                <i className="fa-solid fa-user-group"></i>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Wer?</span>
                                <span className="text-sm font-medium text-slate-500 truncate">{guests} Gäste</span>
                            </div>
                        </div>

                        <div className="ml-2 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform shrink-0">
                            <i className="fa-solid fa-magnifying-glass text-sm"></i>
                        </div>
                    </div>
                ) : (
                    // Full Hero View (Existing)
                    <>
                        <div className="flex items-center gap-4 py-2 pr-8 border-r border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-location-dot text-sm"></i>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-orange-600 transition-colors">Wohin?</span>
                                <span className="text-slate-400 font-medium truncate max-w-[120px]">{location || "Ziele suchen"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-8 border-r border-slate-100 hidden md:flex">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-calendar-days text-sm"></i>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-orange-600 transition-colors">Wann?</span>
                                <span className="text-slate-400 font-medium">
                                    {checkIn ? checkIn.toLocaleDateString('de-DE') : "Beliebige Woche"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-8 hidden md:flex">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-user-group text-sm"></i>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-orange-600 transition-colors">Wer?</span>
                                <span className="text-slate-400 font-medium">{guests} Gäste</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-magnifying-glass text-lg"></i>
                        </div>
                    </>
                )}
            </div>

            {/* --- OPEN STATE (Overlay Wizard) --- */}
            {/* --- OPEN STATE (Overlay Wizard) --- */}
            {(typeof document !== 'undefined') && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-[99998] bg-black/20 backdrop-blur-sm"
                                variants={overlayVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={() => { setIsOpen(false); onClose?.(); }}
                            />
                            <motion.div
                                className="fixed inset-0 z-[99999] bg-white min-h-screen h-full w-screen overflow-hidden flex flex-col"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {/* Header */}
                                <div className="px-8 py-6 flex items-center justify-between shrink-0">
                                    {/* ... Header Content ... */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                                            <i className="fa-solid fa-paper-plane text-xs"></i>
                                        </div>
                                        <span className="text-lg font-black tracking-tighter text-slate-900">VOYANERO</span>
                                    </div>

                                    {/* Step Indicators */}
                                    <div className="flex items-center gap-2 sm:gap-6">
                                        {getStepsForFilter(searchType).map((step, index) => (
                                            <React.Fragment key={step.number}>
                                                <button
                                                    onClick={() => setCurrentStep(step.number as 1 | 2 | 3)}
                                                    className={`flex items-center gap-2 sm:gap-3 transition-colors ${currentStep === step.number ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${currentStep === step.number ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                        {step.number}
                                                    </div>
                                                    <div className="hidden sm:flex flex-col text-left">
                                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 leading-none mb-0.5">{step.title}</span>
                                                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 leading-none">{step.subtitle}</span>
                                                    </div>
                                                </button>
                                                {index < getStepsForFilter(searchType).length - 1 && (
                                                    <div className="w-2 sm:w-6 h-px bg-slate-200"></div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Close */}
                                    <button
                                        onClick={() => { setIsOpen(false); onClose?.(); }}
                                        className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                                    >
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>

                                {/* Content */}
                                <main className="flex-1 flex flex-col items-center pt-24 pb-10 overflow-y-auto">
                                    {/* ... (Content for Steps 1, 2, 3 remains largely the same, maybe wrapping steps in motion.div too for step transitions if desired, but sticking to outer modal first) ... */}
                                    {/* STEP 1: WOHIN */}
                                    {currentStep === 1 && (
                                        <div className="w-full max-w-4xl px-4 text-center animate-in slide-in-from-bottom-8 duration-500">
                                            {/* ... Step 1 Content ... */}
                                            <h2 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">Wohin soll es gehen?</h2>
                                            <p className="text-slate-500 text-lg mb-8">Entdecke exklusive Ziele weltweit.</p>

                                            {/* Filter Toggles */}
                                            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 scale-75 sm:scale-100">
                                                <button onClick={() => setSearchType('reisen')} className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${searchType === 'reisen' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-10 sm:w-12 h-6 sm:h-7 rounded-full transition-all ${searchType === 'reisen' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'reisen' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-xs sm:text-sm">Reisen</span>
                                                </button>
                                                <button onClick={() => setSearchType('fluege')} className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${searchType === 'fluege' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-10 sm:w-12 h-6 sm:h-7 rounded-full transition-all ${searchType === 'fluege' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'fluege' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-xs sm:text-sm">Flüge</span>
                                                </button>
                                                <button onClick={() => setSearchType('unterkunft')} className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${searchType === 'unterkunft' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-10 sm:w-12 h-6 sm:h-7 rounded-full transition-all ${searchType === 'unterkunft' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'unterkunft' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-xs sm:text-sm">Unterkünfte</span>
                                                </button>
                                                <button onClick={() => setSearchType('transfer')} className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${searchType === 'transfer' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-10 sm:w-12 h-6 sm:h-7 rounded-full transition-all ${searchType === 'transfer' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'transfer' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-xs sm:text-sm">Transfer</span>
                                                </button>
                                            </div>

                                            <div className="relative max-w-2xl mx-auto mb-16">
                                                {searchType === 'fluege' ? (
                                                    // Flight-specific: Von/Nach fields
                                                    <div className="space-y-4">
                                                        {/* Flight Type Toggle */}
                                                        <div className="flex justify-center mb-2">
                                                            <div className="bg-slate-100 p-1 rounded-full flex items-center">
                                                                {([
                                                                    { id: 'roundtrip', label: 'Hin- & Rückflug', icon: 'fa-repeat' },
                                                                    { id: 'oneway', label: 'Nur Hinflug', icon: 'fa-arrow-right-long' },
                                                                    { id: 'multicity', label: 'Gabelflug', icon: 'fa-share-nodes' }
                                                                ] as const).map(type => (
                                                                    <button
                                                                        key={type.id}
                                                                        onClick={() => setFlightType(type.id)}
                                                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all ${flightType === type.id
                                                                            ? 'bg-white shadow-sm text-slate-900'
                                                                            : 'text-slate-500 hover:text-slate-700'
                                                                            }`}
                                                                    >
                                                                        <i className={`fa-solid ${type.icon}`}></i>
                                                                        <span>{type.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row items-center gap-2 relative">
                                                            <LocationAutocomplete
                                                                value={flightOrigin}
                                                                onChange={(val) => {
                                                                    setFlightOrigin(val);
                                                                    setFlightOriginCode('');
                                                                }}
                                                                onSelect={(loc) => {
                                                                    setFlightOrigin(loc.address?.cityName || loc.name);
                                                                    setFlightOriginCode(loc.iataCode);
                                                                }}
                                                                placeholder="Von: Abflugort"
                                                                icon="fa-plane-departure"
                                                                autoFocus
                                                            />

                                                            {/* Swap Button (Desktop) */}
                                                            <button
                                                                onClick={() => {
                                                                    const temp = flightOrigin;
                                                                    setFlightOrigin(flightDestination);
                                                                    setFlightDestination(temp);

                                                                    const tempCode = flightOriginCode;
                                                                    setFlightOriginCode(flightDestinationCode);
                                                                    setFlightDestinationCode(tempCode);
                                                                }}
                                                                className="hidden md:flex shrink-0 w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-10 -mx-6 border-4 border-white"
                                                            >
                                                                <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                            </button>

                                                            {/* Swap Button (Mobile) */}
                                                            <button
                                                                onClick={() => {
                                                                    const temp = flightOrigin;
                                                                    setFlightOrigin(flightDestination);
                                                                    setFlightDestination(temp);

                                                                    const tempCode = flightOriginCode;
                                                                    setFlightOriginCode(flightDestinationCode);
                                                                    setFlightDestinationCode(tempCode);
                                                                }}
                                                                className="md:hidden w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all absolute right-4 top-[calc(50%-2.5rem)] rotate-90 z-20"
                                                            >
                                                                <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                            </button>

                                                            <LocationAutocomplete
                                                                value={flightDestination}
                                                                onChange={(val) => {
                                                                    setFlightDestination(val);
                                                                    setFlightDestinationCode('');
                                                                }}
                                                                onSelect={(loc) => {
                                                                    setFlightDestination(loc.address?.cityName || loc.name);
                                                                    setFlightDestinationCode(loc.iataCode);
                                                                }}
                                                                placeholder="Nach: Zielort"
                                                                icon="fa-plane-arrival"
                                                                onEnter={() => flightDestination.length > 0 && setCurrentStep(2)}
                                                            />
                                                        </div>
                                                        {flightOrigin.length > 0 && flightDestination.length > 0 && !flightOriginCode && (
                                                            <div className="text-orange-600 text-sm font-medium bg-orange-50 p-3 rounded-xl">
                                                                ⚠️ Bitte wähle einen Flughafen aus der Vorschlagsliste für "Von"
                                                            </div>
                                                        )}
                                                        {flightOrigin.length > 0 && flightDestination.length > 0 && !flightDestinationCode && (
                                                            <div className="text-orange-600 text-sm font-medium bg-orange-50 p-3 rounded-xl">
                                                                ⚠️ Bitte wähle einen Flughafen aus der Vorschlagsliste für "Nach"
                                                            </div>
                                                        )}
                                                        {flightOriginCode && flightDestinationCode && (
                                                            <button
                                                                onClick={() => setCurrentStep(2)}
                                                                className="w-full h-14 px-8 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all animate-in fade-in zoom-in"
                                                            >
                                                                Bestätigen
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : searchType === 'transfer' ? (
                                                    // Transfer-specific: Pickup/Dropoff fields
                                                    <div className="space-y-4">
                                                        {/* Transfer Type Toggle */}
                                                        <div className="flex justify-center mb-2">
                                                            <div className="bg-slate-100 p-1 rounded-full flex items-center">
                                                                {([
                                                                    { id: 'oneway', label: 'Einfache Fahrt', icon: 'fa-arrow-right-long' },
                                                                    { id: 'roundtrip', label: 'Hin- & Rückfahrt', icon: 'fa-repeat' },
                                                                ] as const).map(type => (
                                                                    <button
                                                                        key={type.id}
                                                                        onClick={() => setTransferType(type.id)}
                                                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all ${transferType === type.id
                                                                            ? 'bg-white shadow-sm text-slate-900'
                                                                            : 'text-slate-500 hover:text-slate-700'
                                                                            }`}
                                                                    >
                                                                        <i className={`fa-solid ${type.icon}`}></i>
                                                                        <span>{type.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                                                <i className="fa-solid fa-car text-xl"></i>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Abholung (Flughafen/Ort)"
                                                                className="w-full h-20 pl-16 pr-6 rounded-full border-2 border-orange-100 bg-white shadow-[0_8px_30px_rgba(234,88,12,0.06)] text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-[#FF385C]/10 placeholder:text-slate-300 transition-all font-jakarta"
                                                                value={transferOrigin}
                                                                onChange={(e) => setTransferOrigin(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                                                <i className="fa-solid fa-location-dot text-xl"></i>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Zielort (Hotel/Adresse)"
                                                                className="w-full h-20 pl-16 pr-6 rounded-full border-2 border-orange-100 bg-white shadow-[0_8px_30px_rgba(234,88,12,0.06)] text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-[#FF385C]/10 placeholder:text-slate-300 transition-all font-jakarta"
                                                                value={transferDestination}
                                                                onChange={(e) => setTransferDestination(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && transferDestination.length > 0 && setCurrentStep(2)}
                                                            />
                                                        </div>
                                                        {transferOrigin.length > 0 && transferDestination.length > 0 && (
                                                            <button
                                                                onClick={() => setCurrentStep(2)}
                                                                className="w-full h-14 px-8 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all animate-in fade-in zoom-in"
                                                            >
                                                                Bestätigen
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // Default: Single destination field per Reisen/Unterkünfte
                                                    <div className="relative group">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                                            <i className="fa-solid fa-magnifying-glass text-xl"></i>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Ort, Region oder Unterkunft suchen..."
                                                            className="w-full h-20 pl-16 pr-6 rounded-full border-2 border-orange-100 bg-white shadow-[0_8px_30px_rgba(234,88,12,0.06)] text-lg font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-[#FF385C]/10 placeholder:text-slate-300 transition-all font-jakarta"
                                                            value={location}
                                                            onChange={(e) => setLocation(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && setCurrentStep(2)}
                                                            autoFocus
                                                        />
                                                        {showConfirm && (
                                                            <button
                                                                onClick={() => setCurrentStep(2)}
                                                                className="absolute right-3 top-3 h-14 px-8 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all animate-in fade-in zoom-in"
                                                            >
                                                                Bestätigen
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {searchType !== 'fluege' && (
                                                <div className="flex flex-wrap justify-center gap-6">
                                                    <button
                                                        onClick={handleLocateMe}
                                                        className="w-40 h-40 bg-white border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-slate-900 hover:scale-105 transition-all group"
                                                    >
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                                            {isLocating ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-location-crosshairs"></i>}
                                                        </div>
                                                        <span className="text-xs font-black text-slate-900">Mein Standort</span>
                                                    </button>

                                                    {DESTINATIONS.map(dest => {
                                                        const isActive = location === dest.label;
                                                        return (
                                                            <button
                                                                key={dest.name}
                                                                onClick={() => {
                                                                    if (searchType === 'transfer') {
                                                                        setTransferDestination(dest.label);
                                                                        if (transferOrigin) {
                                                                            setCurrentStep(2);
                                                                        } else {
                                                                            document.querySelector<HTMLInputElement>('input[placeholder^="Abholung"]')?.focus();
                                                                        }
                                                                    } else {
                                                                        setLocation(dest.label);
                                                                        setCurrentStep(2);
                                                                    }
                                                                }}
                                                                className={`w-40 h-40 bg-white rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 group relative overflow-hidden
                                                                ${isActive
                                                                        ? 'border-[3px] border-slate-900 shadow-xl scale-105'
                                                                        : 'border border-slate-100 hover:border-slate-300 hover:shadow-lg hover:scale-105'
                                                                    }`}
                                                            >
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300
                                                                ${isActive
                                                                        ? 'bg-slate-900 text-white'
                                                                        : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                                                                    }`}>
                                                                    <i className={`fa-solid ${dest.icon}`}></i>
                                                                </div>
                                                                <span className={`text-xs font-black transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-900'}`}>{dest.label}</span>

                                                                {isActive && (
                                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center animate-in zoom-in">
                                                                        <i className="fa-solid fa-check text-white text-[10px]"></i>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* STEP 2: WANN */}
                                    {currentStep === 2 && (
                                        <div className="w-full max-w-7xl px-4 text-center animate-in slide-in-from-right-8 duration-500">
                                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Wann möchtest du reisen?</h2>
                                            <p className="text-slate-500 text-lg md:text-xl mb-12 font-medium">Finde die besten Flugpreise.</p>

                                            {searchType === 'fluege' ? (
                                                <div className="flex justify-center">
                                                    <SearchCalendar
                                                        checkIn={checkIn}
                                                        checkOut={checkOut}
                                                        onChange={(start, end) => {
                                                            setCheckIn(start);
                                                            setCheckOut(end);
                                                        }}
                                                        onClose={() => setCurrentStep(3)}
                                                        origin={flightOrigin}
                                                        destination={flightDestination}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-start justify-center">
                                                    {/* Shortcuts */}
                                                    <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-96">
                                                        <button
                                                            onClick={() => setCurrentStep(3)}
                                                            className="w-full p-6 lg:p-8 bg-white border border-slate-100 rounded-[2rem] lg:rounded-[2.5rem] flex items-center gap-6 hover:border-[#FF385C] transition-all group text-left shadow-sm order-2 lg:order-1"
                                                        >
                                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                                                                <i className="fa-solid fa-bolt"></i>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-black text-lg text-slate-900">Dieses Wochenende</h3>
                                                                <p className="text-xs text-slate-500 font-medium">Perfekt für eine spontane Reise</p>
                                                            </div>
                                                        </button>

                                                        <div className="bg-[#1a1a1a] p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] text-white text-center order-1 lg:order-3 min-w-[280px]">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffffff60] mb-4">{dateLabels.label}</p>
                                                            <div className="flex items-center justify-center gap-6">
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-[9px] text-[#ffffff60] font-bold uppercase tracking-wider">{dateLabels.start}</span>
                                                                    <span className={`text-xl font-black ${checkIn ? 'text-white' : 'text-[#ffffff40]'}`}>
                                                                        {checkIn ? checkIn.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                                                                    </span>
                                                                </div>
                                                                <div className="h-8 w-px bg-[#ffffff20]"></div>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-[9px] text-[#ffffff60] font-bold uppercase tracking-wider">{dateLabels.end}</span>
                                                                    <span className={`text-xl font-black ${checkOut ? 'text-white' : 'text-[#ffffff40]'}`}>
                                                                        {checkOut ? checkOut.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Calendar */}
                                                    <div className="flex-1 w-full">
                                                        {renderCalendar()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* STEP 3: WER */}
                                    {currentStep === 3 && (
                                        <div className="w-full max-w-lg mx-auto px-4 text-center animate-in slide-in-from-right-8 duration-500">
                                            {/* ... Step 3 Content ... */}
                                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Wer reist mit?</h2>

                                            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl text-left space-y-8">
                                                {/* Erwachsene */}
                                                <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                                                    <div>
                                                        <p className="font-black text-lg text-slate-900">Erwachsene</p>
                                                        <p className="text-slate-400 text-sm font-medium">Ab 13 Jahren</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                                            className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${adults > 1 ? 'hover:border-slate-800 text-slate-600 hover:text-slate-900' : 'opacity-30 cursor-not-allowed'}`}
                                                            disabled={adults <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus text-sm"></i>
                                                        </button>
                                                        <span className="text-xl font-black text-slate-900 w-6 text-center">{adults}</span>
                                                        <button
                                                            onClick={() => setAdults(adults + 1)}
                                                            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-800 text-slate-600 hover:text-slate-900 transition-all"
                                                        >
                                                            <i className="fa-solid fa-plus text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Kinder */}
                                                <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                                                    <div>
                                                        <p className="font-black text-lg text-slate-900">Kinder</p>
                                                        <p className="text-slate-400 text-sm font-medium">2–12 Jahre alt</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                                            className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${children > 0 ? 'hover:border-slate-800 text-slate-600 hover:text-slate-900' : 'opacity-30 cursor-not-allowed'}`}
                                                            disabled={children <= 0}
                                                        >
                                                            <i className="fa-solid fa-minus text-sm"></i>
                                                        </button>
                                                        <span className="text-xl font-black text-slate-900 w-6 text-center">{children}</span>
                                                        <button
                                                            onClick={() => setChildren(children + 1)}
                                                            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-800 text-slate-600 hover:text-slate-900 transition-all"
                                                        >
                                                            <i className="fa-solid fa-plus text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Kleinkinder */}
                                                <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                                                    <div>
                                                        <p className="font-black text-lg text-slate-900">Kleinkinder</p>
                                                        <p className="text-slate-400 text-sm font-medium">Unter 2 Jahren</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={() => setInfants(Math.max(0, infants - 1))}
                                                            className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${infants > 0 ? 'hover:border-slate-800 text-slate-600 hover:text-slate-900' : 'opacity-30 cursor-not-allowed'}`}
                                                            disabled={infants <= 0}
                                                        >
                                                            <i className="fa-solid fa-minus text-sm"></i>
                                                        </button>
                                                        <span className="text-xl font-black text-slate-900 w-6 text-center">{infants}</span>
                                                        <button
                                                            onClick={() => setInfants(infants + 1)}
                                                            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-800 text-slate-600 hover:text-slate-900 transition-all"
                                                        >
                                                            <i className="fa-solid fa-plus text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Haustiere */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-black text-lg text-slate-900">Haustiere</p>
                                                        <a href="#" className="text-slate-400 text-sm font-medium underline underline-offset-4 hover:text-slate-800 transition-colors">Hast du ein Assistenztier dabei?</a>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <button
                                                            onClick={() => setPets(Math.max(0, pets - 1))}
                                                            className={`w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center transition-all ${pets > 0 ? 'hover:border-slate-800 text-slate-600 hover:text-slate-900' : 'opacity-30 cursor-not-allowed'}`}
                                                            disabled={pets <= 0}
                                                        >
                                                            <i className="fa-solid fa-minus text-sm"></i>
                                                        </button>
                                                        <span className="text-xl font-black text-slate-900 w-6 text-center">{pets}</span>
                                                        <button
                                                            onClick={() => setPets(pets + 1)}
                                                            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-800 text-slate-600 hover:text-slate-900 transition-all"
                                                        >
                                                            <i className="fa-solid fa-plus text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </main>

                                {/* Footer */}
                                {(currentStep === 2 || currentStep === 3) && (
                                    <div className="p-8 flex justify-end max-w-7xl mx-auto w-full shrink-0">
                                        <button
                                            onClick={currentStep === 3 ? handleSearch : () => setCurrentStep(3)}
                                            className="bg-[#1a1a1a] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-4 shadow-xl"
                                        >
                                            {currentStep === 3 ? 'Ergebnisse zeigen' : 'Weiter'}
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default SearchMask;
