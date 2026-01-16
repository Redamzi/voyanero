"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchMaskProps {
    variant?: 'hero' | 'default' | 'compact';
    initialLocation?: string;
    onClose?: () => void;
    isOpen?: boolean;
}

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

    // Search Type Filter (Reisen/Flüge/Unterkünfte)
    const [searchType, setSearchType] = useState<'reisen' | 'fluege' | 'unterkunft'>('reisen');

    // Filter "bestätigen" visibility
    const showConfirm = location.length > 0;

    const handleSearch = () => {
        setIsOpen(false);
        onClose?.();
        // Format date as YYYY-MM-DD for API
        const formatDate = (d: Date | null) => d ? d.toISOString().split('T')[0] : "";

        const params = new URLSearchParams({
            type: searchType,
            location,
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
                                className="fixed inset-0 z-[99999] bg-white h-[100dvh] w-screen overflow-hidden flex flex-col"
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
                                    <div className="flex items-center gap-2 sm:gap-12">
                                        <button onClick={() => setCurrentStep(1)} className={`flex items-center gap-3 transition-colors ${currentStep === 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 1 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
                                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-slate-900">Wohin</span>
                                        </button>
                                        <div className="w-2 sm:w-8 h-px bg-slate-200"></div>
                                        <button onClick={() => setCurrentStep(2)} className={`flex items-center gap-3 transition-colors ${currentStep === 2 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 2 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
                                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-slate-900">Wann</span>
                                        </button>
                                        <div className="w-2 sm:w-8 h-px bg-slate-200"></div>
                                        <button onClick={() => setCurrentStep(3)} className={`flex items-center gap-3 transition-colors ${currentStep === 3 ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 3 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3</div>
                                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-slate-900">Wer</span>
                                        </button>
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
                                            <div className="flex items-center justify-center gap-4 mb-8">
                                                <button onClick={() => setSearchType('reisen')} className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${searchType === 'reisen' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-12 h-7 rounded-full transition-all ${searchType === 'reisen' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'reisen' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-sm">Reisen</span>
                                                </button>
                                                <button onClick={() => setSearchType('fluege')} className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${searchType === 'fluege' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-12 h-7 rounded-full transition-all ${searchType === 'fluege' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'fluege' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-sm">Flüge</span>
                                                </button>
                                                <button onClick={() => setSearchType('unterkunft')} className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${searchType === 'unterkunft' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    <div className={`w-12 h-7 rounded-full transition-all ${searchType === 'unterkunft' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-300'}`}>
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${searchType === 'unterkunft' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </div>
                                                    <span className="font-semibold text-sm">Unterkünfte</span>
                                                </button>
                                            </div>

                                            <div className="relative max-w-2xl mx-auto mb-16 group">
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
                                                            onClick={() => { setLocation(dest.label); setCurrentStep(2); }}
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
                                        </div>
                                    )}

                                    {/* STEP 2: WANN */}
                                    {currentStep === 2 && (
                                        <div className="w-full max-w-5xl px-4 text-center animate-in slide-in-from-right-8 duration-500">
                                            {/* ... Step 2 Content ... */}
                                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Wann möchtest du reisen?</h2>
                                            <p className="text-slate-500 text-lg md:text-xl mb-12 font-medium">Wähle einen Zeitraum oder spezifische Daten.</p>

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

                                                    <button
                                                        onClick={() => setCurrentStep(3)}
                                                        className="w-full p-6 lg:p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center gap-6 hover:border-blue-500 transition-all group text-left shadow-sm hidden lg:flex order-3 lg:order-2"
                                                    >
                                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                                                            <i className="fa-regular fa-calendar-check"></i>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-lg text-slate-900">Nächsten Monat</h3>
                                                            <p className="text-xs text-slate-500 font-medium">Genügend Zeit für die Vorbereitung</p>
                                                        </div>
                                                    </button>

                                                    <div className="bg-[#1a1a1a] p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] text-white text-center order-1 lg:order-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffffff60] mb-2">Gewählter Zeitraum</p>
                                                        <div className="flex items-center justify-center gap-4 text-xl font-black">
                                                            <span>{checkIn ? checkIn.toLocaleDateString('de-DE') : 'Anreise'}</span>
                                                            <div className="h-0.5 w-4 bg-[#ffffff30]"></div>
                                                            <span>{checkOut ? checkOut.toLocaleDateString('de-DE') : 'Abreise'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Calendar */}
                                                <div className="flex-1 w-full">
                                                    {renderCalendar()}
                                                </div>
                                            </div>
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
