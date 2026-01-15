"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '@/components/ListingCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_LISTINGS } from '@/constants';
import { Listing, ListingType, PropertyType } from '@/types';
import { FlightService } from '@/services/api';
import { HotelService } from '@/services/hotelService';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, damping: 20, stiffness: 100 }
    }
};

const checkboxVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.8 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 200, damping: 20 }
    },
    exit: { opacity: 0, x: -20, scale: 0.8 }
};

const SelectableListing = ({ listing, isSelectionMode }: { listing: Listing, isSelectionMode: boolean }) => {
    return (
        <motion.div
            layout
            className="relative group"
            variants={itemVariants}
        >
            <div className="flex items-start">
                <AnimatePresence>
                    {isSelectionMode && (
                        <motion.div
                            variants={checkboxVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mr-4 mt-24 shrink-0"
                        >
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center cursor-pointer hover:border-rose-500 hover:text-rose-500 transition-colors">
                                <i className="fa-solid fa-check text-white"></i>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    layout
                    className="flex-1 min-w-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <ListingCard listing={listing} />
                </motion.div>
            </div>
        </motion.div>
    );
};

function SearchContent() {
    const searchParams = useSearchParams();
    const locationQuery = searchParams.get('location') || '';
    const dateQuery = searchParams.get('checkIn') || '';

    // Guest params
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 100, max: 2000 });
    const [counts, setCounts] = useState({ bedrooms: 0, beds: 0, bathrooms: 0 });

    // API State
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const histogramData = [12, 25, 40, 60, 85, 100, 95, 80, 65, 50, 35, 20, 15, 10, 8];

    // Fetch Flights
    // Fetch Data (Flights & Hotels)
    React.useEffect(() => {
        const fetchData = async () => {
            if (!locationQuery && !dateQuery) {
                setListings(MOCK_LISTINGS);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // parallel fetch
                const [flightRes, hotelRes] = await Promise.all([
                    FlightService.searchFlights({
                        origin: "MUC",
                        destination: locationQuery,
                        date: dateQuery || new Date().toISOString().split('T')[0],
                        adults,
                        children,
                        infants
                    }),
                    HotelService.searchHotels(locationQuery)
                ]);

                let combinedListings: Listing[] = [];

                // Process Flights
                if (flightRes.success && flightRes.flights && flightRes.flights.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const flightListings: Listing[] = flightRes.flights.map((flight: any, index: number) => ({
                        id: `flight-${index}`,
                        title: `Flug mit ${flight.airline || 'Airline'}`,
                        description: `Ab ${new Date(flight.departure_at).toLocaleDateString('de-DE')}`,
                        type: ListingType.AFFILIATE,
                        propertyType: PropertyType.HOTEL, // Using Hotel type for now
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
                    combinedListings = [...combinedListings, ...flightListings];
                }

                // Process Hotels
                if (hotelRes && hotelRes.length > 0) {
                    const hotelListings: Listing[] = hotelRes.map((hotel) => ({
                        id: hotel.id,
                        title: hotel.title,
                        description: hotel.description,
                        type: ListingType.AFFILIATE,
                        propertyType: PropertyType.HOTEL,
                        price: hotel.price,
                        location: {
                            address: hotel.location,
                            lat: 0,
                            lng: 0
                        },
                        images: [hotel.image],
                        amenities: hotel.amenities,
                        rating: hotel.rating,
                        reviewCount: hotel.reviews,
                        maxGuests: 2, // Mock default
                        affiliateUrl: hotel.deepLink
                    }));
                    combinedListings = [...combinedListings, ...hotelListings];
                }

                if (combinedListings.length > 0) {
                    setListings(combinedListings);
                } else {
                    setListings([]);
                    setError("Keine Ergebnisse gefunden. Versuche andere Daten oder Ziele.");
                }

            } catch (err) {
                console.error("Data fetch failed", err);
                setError("Daten konnten nicht geladen werden.");
                setListings(MOCK_LISTINGS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
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
        return listings.filter(l => l.price >= priceRange.min && l.price <= priceRange.max);
    }, [listings, priceRange]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar
                onFilterClick={() => setIsFilterModalOpen(true)}
                forceCompact={true}
                onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
            />

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
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredListings.map(listing => (
                                <SelectableListing key={listing.id} listing={listing} isSelectionMode={isSelectionMode} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
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
                                                <div key={i} className={`flex-1 rounded-t-md transition-all duration-500 ${active ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-slate-100'}`} style={{ height: `${h}%` }}></div>
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
