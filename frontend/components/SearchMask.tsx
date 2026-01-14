"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchMaskProps {
    variant?: 'hero' | 'compact';
}

const DESTINATIONS = [
    { name: "Bali, Indonesia", icon: "fa-umbrella-beach" },
    { name: "Berlin, Germany", icon: "fa-city" },
    { name: "Rome, Italy", icon: "fa-monument" },
    { name: "New York, USA", icon: "fa-building" },
    { name: "Tokyo, Japan", icon: "fa-torii-gate" }
];

const SearchMask: React.FC<SearchMaskProps> = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'stays' | 'concierge'>('stays');
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [isLocating, setIsLocating] = useState(false);

    const handleSearch = () => {
        setIsOpen(false);
        const params = new URLSearchParams({
            location,
            checkIn,
            checkOut,
            guests: guests.toString()
        });
        router.push(`/search?${params.toString()}`);
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        setTimeout(() => {
            setLocation("In meiner Nähe");
            setIsLocating(false);
            setCurrentStep(2);
        }, 1500);
    };

    return (
        <>
            {/* --- CLOSED STATE (Floating Bar) --- */}
            <div
                onClick={() => setIsOpen(true)}
                className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2 pl-8 flex items-center justify-between max-w-3xl w-full mx-auto cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group"
            >
                <div className="flex flex-col text-left py-2 pr-8 border-r border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-rose-500 transition-colors">Wohin?</span>
                    <span className="text-slate-400 font-medium truncate max-w-[120px]">{location || "Ziele suchen"}</span>
                </div>
                <div className="flex flex-col text-left px-8 border-r border-slate-100 hidden md:flex">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-rose-500 transition-colors">Wann?</span>
                    <span className="text-slate-400 font-medium">Beliebige Woche</span>
                </div>
                <div className="flex flex-col text-left px-8 hidden md:flex">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-rose-500 transition-colors">Wer?</span>
                    <span className="text-slate-400 font-medium">Gäste hinzufügen</span>
                </div>
                <div className="w-12 h-12 bg-[#FF385C] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-magnifying-glass text-lg"></i>
                </div>
            </div>

            {/* --- OPEN STATE (Overlay Wizard) --- */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
                    {/* Wizard Header */}
                    <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white">
                                <i className="fa-solid fa-paper-plane"></i>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">VOYANERO</span>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-full">
                            <button
                                onClick={() => setActiveTab('stays')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'stays' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Unterkünfte
                            </button>
                            <button
                                onClick={() => setActiveTab('concierge')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'concierge' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                AI Concierge
                                <span className="bg-indigo-100 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Neu</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    {/* Wizard Content */}
                    <main className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto w-full">
                        <div className="w-full max-w-5xl px-6 my-auto">

                            {/* STEP 1: WHERE */}
                            {currentStep === 1 && (
                                <div className="animate-in slide-in-from-bottom-8 duration-500 text-center">
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Wohin soll die Reise gehen?</h2>
                                    <p className="text-slate-500 text-lg md:text-xl mb-12 font-medium">Wähle eine Region oder nimm den AI Concierge mit.</p>

                                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                        <button
                                            onClick={handleLocateMe}
                                            className={`group flex flex-col items-center gap-5 p-6 rounded-[2rem] border bg-white transition-all hover:shadow-xl hover:scale-[1.05] ${location === "In meiner Nähe" ? 'border-indigo-500 ring-2 ring-indigo-500/5' : 'border-slate-100'}`}
                                        >
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${location === "In meiner Nähe" ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                                {isLocating ? (
                                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                                ) : (
                                                    <i className="fa-solid fa-location-crosshairs"></i>
                                                )}
                                            </div>
                                            <span className="font-black text-slate-900 text-sm whitespace-nowrap">Mein Standort</span>
                                        </button>

                                        {DESTINATIONS.map(dest => (
                                            <button
                                                key={dest.name}
                                                onClick={() => { setLocation(dest.name); setCurrentStep(2); }}
                                                className={`group flex flex-col items-center gap-5 p-6 rounded-[2rem] border bg-white transition-all hover:shadow-xl hover:scale-[1.05] ${location === dest.name ? 'border-[#FF385C] ring-2 ring-rose-500/5' : 'border-slate-100'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${location === dest.name ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500'}`}>
                                                    <i className={`fa-solid ${dest.icon}`}></i>
                                                </div>
                                                <span className="font-black text-slate-900 text-sm whitespace-nowrap">{dest.name.split(',')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: WHEN */}
                            {currentStep === 2 && (
                                <div className="animate-in slide-in-from-right-8 duration-500 text-center">
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Wann möchtest du reisen?</h2>
                                    <p className="text-slate-500 text-lg md:text-xl mb-12 font-medium">Wähle einen Zeitraum für deine Auszeit.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                                        <button onClick={() => setCurrentStep(3)} className="p-12 border border-slate-100 bg-white rounded-[3.5rem] hover:border-[#FF385C] hover:bg-rose-50/10 transition-all group shadow-sm hover:shadow-xl text-left">
                                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                <i className="fa-solid fa-bolt"></i>
                                            </div>
                                            <p className="font-black text-3xl text-slate-900 mb-3">Dieses Wochenende</p>
                                            <p className="text-slate-400 text-lg font-medium">Perfekt für eine spontane Reise</p>
                                        </button>
                                        <button onClick={() => setCurrentStep(3)} className="p-12 border border-slate-100 bg-white rounded-[3.5rem] hover:border-[#FF385C] hover:bg-rose-50/10 transition-all group shadow-sm hover:shadow-xl text-left">
                                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <i className="fa-solid fa-calendar-check"></i>
                                            </div>
                                            <p className="font-black text-3xl text-slate-900 mb-3">Nächsten Monat</p>
                                            <p className="text-slate-400 text-lg font-medium">Genügend Zeit für die Vorbereitung</p>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: WHO */}
                            {currentStep === 3 && (
                                <div className="animate-in slide-in-from-right-8 duration-500 text-center">
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Wer reist mit?</h2>
                                    <p className="text-slate-500 text-lg md:text-xl mb-12 font-medium">Anzahl der Gäste für passende Angebote.</p>

                                    <div className="max-w-2xl mx-auto bg-white border border-slate-100 p-16 rounded-[4rem] shadow-2xl">
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <p className="font-black text-4xl text-slate-900 mb-2">Gäste</p>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Anzahl der Personen</p>
                                            </div>
                                            <div className="flex items-center gap-12">
                                                <button
                                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                                    className="w-20 h-20 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#FF385C] hover:text-[#FF385C] transition-all bg-white shadow-sm"
                                                >
                                                    <i className="fa-solid fa-minus text-2xl"></i>
                                                </button>
                                                <span className="w-12 text-center font-black text-5xl text-slate-900">{guests}</span>
                                                <button
                                                    onClick={() => setGuests(guests + 1)}
                                                    className="w-20 h-20 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#FF385C] hover:text-[#FF385C] transition-all bg-white shadow-sm"
                                                >
                                                    <i className="fa-solid fa-plus text-2xl"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Wizard Footer Navigation */}
                    <footer className="px-10 py-10 border-t border-slate-100 bg-white shrink-0 flex items-center justify-center">
                        <div className="w-full max-w-4xl flex items-center justify-between">
                            <button
                                onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as any)}
                                className={`flex items-center gap-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Zurück
                            </button>

                            <div className="flex items-center gap-4">
                                {currentStep < 3 ? (
                                    <button
                                        onClick={() => setCurrentStep((currentStep + 1) as any)}
                                        className="bg-slate-900 text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-4"
                                    >
                                        Weiter
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSearch}
                                        className="bg-[#FF385C] text-white px-20 py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-widest hover:bg-rose-600 shadow-2xl shadow-rose-200 transition-all flex items-center gap-4 scale-110 active:scale-105"
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                        Ergebnisse zeigen
                                    </button>
                                )}
                            </div>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default SearchMask;
