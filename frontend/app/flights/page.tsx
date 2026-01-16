"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FlightsPage() {
    const router = useRouter();
    const [origin, setOrigin] = useState('MUC');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [adults, setAdults] = useState(1);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination) {
            router.push(`/search?location=${destination}&checkIn=${date}&adults=${adults}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />

            <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Flugsuche
                    </h1>
                    <p className="text-xl text-slate-600">
                        Finde die besten Flüge zu deinem Traumziel
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Origin */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Von (Abflugort)
                                </label>
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="z.B. MUC, BER, FRA"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">IATA-Code oder Stadt</p>
                            </div>

                            {/* Destination */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Nach (Zielort)
                                </label>
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="z.B. Bali, DPS, NYC"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">IATA-Code oder Stadt</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Abflugdatum
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            {/* Passengers */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Passagiere
                                </label>
                                <select
                                    value={adults}
                                    onChange={(e) => setAdults(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'Personen'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <i className="fa-solid fa-plane-departure mr-3"></i>
                            Flüge suchen
                        </button>
                    </form>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-100">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i className="fa-solid fa-tag text-orange-600 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Beste Preise</h3>
                            <p className="text-sm text-slate-600">Vergleiche Hunderte Airlines</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i className="fa-solid fa-shield-halved text-blue-600 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Sicher buchen</h3>
                            <p className="text-sm text-slate-600">Geprüfte Partner</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i className="fa-solid fa-clock text-green-600 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">Schnell & einfach</h3>
                            <p className="text-sm text-slate-600">In Sekunden buchen</p>
                        </div>
                    </div>
                </div>

                {/* Popular Destinations */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">Beliebte Ziele</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { city: 'Bali', code: 'DPS', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop' },
                            { city: 'New York', code: 'NYC', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&auto=format&fit=crop' },
                            { city: 'Tokyo', code: 'TYO', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&auto=format&fit=crop' },
                            { city: 'Dubai', code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&auto=format&fit=crop' }
                        ].map((dest) => (
                            <button
                                key={dest.code}
                                onClick={() => {
                                    setDestination(dest.code);
                                    setDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                                }}
                                className="relative h-32 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 text-left">
                                    <p className="text-white font-black text-lg">{dest.city}</p>
                                    <p className="text-white/80 text-xs">{dest.code}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
