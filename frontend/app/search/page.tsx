"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ListingCard from '@/components/ListingCard';
import SearchMask from '@/components/SearchMask';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_LISTINGS } from '@/constants';
import { Listing, ListingType, PropertyType } from '@/types';
import { FlightService } from '@/services/api';

function SearchContent() {
    const searchParams = useSearchParams();
    const locationQuery = searchParams.get('location') || '';
    const dateQuery = searchParams.get('checkIn') || '';

    // Guest params
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 100, max: 2000 });
    const [counts, setCounts] = useState({ bedrooms: 0, beds: 0, bathrooms: 0 });

    // API State
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const histogramData = [12, 25, 40, 60, 85, 100, 95, 80, 65, 50, 35, 20, 15, 10, 8];

    // Fetch Flights
    React.useEffect(() => {
        const fetchFlights = async () => {
            if (!locationQuery || !dateQuery) {
                // Fallback to mock if no search
                setListings(MOCK_LISTINGS);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Data Access API returns results immediately
                const searchRes = await FlightService.searchFlights({
                    origin: "MUC", // Hardcoded for now
                    destination: locationQuery,
                    date: dateQuery,
                    adults,
                    children,
                    infants
                });

                // Data Access API returns: { success: true, flights: [...] }
                if (searchRes.success && searchRes.flights && searchRes.flights.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mappedListings: Listing[] = searchRes.flights.map((flight: any, index: number) => ({
                        id: `flight-${index}`,
                        title: `Flug mit ${flight.airline || 'Airline'}`,
                        description: `Ab ${new Date(flight.departure_at).toLocaleDateString('de-DE')}`,
                        type: ListingType.AFFILIATE,
                        propertyType: PropertyType.HOTEL,
                        price: flight.price || 0,
                        location: {
                            address: `${flight.origin || 'MUC'} → ${flight.destination || locationQuery}`,
                            lat: 0,
                            lng: 0
                        },
                        images: [`http://pics.avs.io/200/200/${flight.airline}.png`],
                        amenities: ["Direktflug", "Economy"],
                        rating: 4.5,
                        reviewCount: 10 + Math.floor(Math.random() * 50),
                        maxGuests: adults + children,
                        affiliateUrl: `https://www.aviasales.com/search/${flight.origin}${new Date(flight.departure_at).toISOString().split('T')[0]}${flight.destination}1?marker=${flight.marker}`
                    }));

                    setListings(mappedListings);
                } else {
                    // No results found
                    setListings([]);
                    setError("Keine Flüge gefunden. Versuche andere Daten oder Ziele.");
                }

            } catch (err) {
                console.error("Flight fetch failed", err);
                setError("Flüge konnten nicht geladen werden.");
                setListings(MOCK_LISTINGS); // Fallback so UI isn't broken
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [locationQuery, dateQuery, adults, children, infants]);


    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val <= priceRange.max) setPriceRange({ ...priceRange, min: val });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val >= priceRange.min) setPriceRange({ ...priceRange, max: val });
    };

    const filteredListings = useMemo(() => {
        // Apply local filtering to the fetched listings (mock or real)
        return listings.filter(l => l.price >= priceRange.min && l.price <= priceRange.max);
    }, [listings, priceRange]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Sticky Filter Header */}
            <div className="sticky top-20 z-[40] bg-white border-b border-slate-100 py-4 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-4">
                    <div className="flex-1">
                        <SearchMask initialLocation={locationQuery} />
                    </div>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="h-12 px-6 border border-slate-200 rounded-full flex items-center gap-3 font-bold text-sm text-slate-700 hover:border-slate-900 transition-all bg-white"
                    >
                        <i className="fa-solid fa-sliders"></i>
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10 text-left">
                <h1 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                    {isLoading ? 'Suche Flüge...' : `${filteredListings.length} Angebote gefunden`}
                </h1>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-center">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-slate-100 rounded-[1.2rem] aspect-[20/19] mb-3"></div>
                                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {filteredListings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>

            {/* FULLSCREEN FILTER MODAL */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-[1100] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <header className="px-8 py-6 border-b border-slate-100 flex items-center shrink-0 bg-white relative">
                        <button onClick={() => setIsFilterModalOpen(false)} className="w-12 h-12 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-10">
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-black text-slate-900 uppercase tracking-widest">Filter</h2>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-slate-50/10">
                        <div className="max-w-4xl mx-auto py-12 px-6 space-y-20">
                            {/* Preisspanne */}
                            <section className="text-left">
                                <h3 className="text-3xl font-black text-slate-900 mb-2">Preisspanne</h3>
                                <p className="text-lg text-slate-500 font-medium mb-16">Durchschnittlicher Übernachtungspreis ohne Gebühren.</p>

                                <div className="px-12 relative mb-20 h-48 flex flex-col justify-end">
                                    {/* Histogramm */}
                                    <div className="h-36 flex items-end gap-[3px] mb-[-14px]">
                                        {histogramData.map((h, i) => {
                                            const pos = (i / (histogramData.length - 1)) * 1000;
                                            const active = pos >= priceRange.min && pos <= priceRange.max;
                                            return (
                                                <div key={i} className={`flex-1 rounded-t-md transition-all duration-500 ${active ? 'bg-[#FF385C]' : 'bg-slate-100'}`} style={{ height: `${h}%` }}></div>
                                            );
                                        })}
                                    </div>

                                    {/* Slider UI */}
                                    <div className="price-slider-container">
                                        <div className="price-slider-track"></div>
                                        <div
                                            className="price-slider-range"
                                            style={{
                                                left: `${(priceRange.min / 1000) * 100}%`,
                                                width: `${((priceRange.max - priceRange.min) / 1000) * 100}%`
                                            }}
                                        ></div>
                                        <input type="range" min="0" max="1000" step="10" value={priceRange.min} onChange={handleMinChange} className="z-30" />
                                        <input type="range" min="0" max="1000" step="10" value={priceRange.max} onChange={handleMaxChange} className="z-20" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                                    <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] bg-white text-center shadow-sm hover:border-slate-900 hover:shadow-xl transition-all duration-300 group cursor-default">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 group-hover:text-slate-900 transition-colors">Minimum</p>
                                        <p className="text-4xl font-black text-slate-900">€{priceRange.min}</p>
                                    </div>
                                    <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] bg-white text-center shadow-sm hover:border-slate-900 hover:shadow-xl transition-all duration-300 group cursor-default">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 group-hover:text-slate-900 transition-colors">Maximum</p>
                                        <p className="text-4xl font-black text-slate-900">€{priceRange.max}+</p>
                                    </div>
                                </div>
                            </section>

                            {/* Zimmer und Betten */}
                            <section className="text-left border-t border-slate-100 pt-20">
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Zimmer und Betten</h3>
                                <p className="text-lg text-slate-500 font-medium mb-16">Wähle die passende Größe für deine Unterkunft.</p>
                                <div className="space-y-12 max-w-2xl">
                                    {[
                                        { key: 'bedrooms' as const, label: 'Schlafzimmer' },
                                        { key: 'beds' as const, label: 'Betten' },
                                        { key: 'bathrooms' as const, label: 'Badezimmer' }
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                            <span className="font-black text-slate-800 text-xl">{item.label}</span>
                                            <div className="flex items-center gap-10">
                                                <button
                                                    onClick={() => setCounts({ ...counts, [item.key]: Math.max(0, counts[item.key] - 1) })}
                                                    className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#FF385C] hover:text-[#FF385C] transition-all"
                                                >
                                                    <i className="fa-solid fa-minus text-xl"></i>
                                                </button>
                                                <span className="w-10 text-center font-black text-3xl text-slate-900">{counts[item.key]}</span>
                                                <button
                                                    onClick={() => setCounts({ ...counts, [item.key]: counts[item.key] + 1 })}
                                                    className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#FF385C] hover:text-[#FF385C] transition-all"
                                                >
                                                    <i className="fa-solid fa-plus text-xl"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>

                    <footer className="px-10 py-10 border-t border-slate-100 flex items-center justify-center shrink-0 bg-white">
                        <div className="w-full max-w-4xl flex items-center justify-between">
                            <button
                                onClick={() => { setPriceRange({ min: 100, max: 800 }); setCounts({ bedrooms: 0, beds: 0, bathrooms: 0 }); }}
                                className="text-sm font-black text-slate-900 underline underline-offset-[12px] decoration-2 hover:text-[#FF385C] transition-colors uppercase tracking-widest"
                            >
                                Alle löschen
                            </button>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="bg-slate-900 text-white px-20 py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl active:scale-95"
                            >
                                {filteredListings.length} Ergebnisse anzeigen
                            </button>
                        </div>
                    </footer>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
