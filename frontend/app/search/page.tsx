"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '@/components/ListingCard';
import ListingPreviewModal from '@/components/ListingPreviewModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_LISTINGS } from '@/constants';
import { Listing, PropertyType } from '@/types';
// import { FlightService } from '@/services/api';
// import { HotelService } from '@/services/hotelService';

// --- ANIMATION VARIANTS ---
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

const SelectableListing = ({ listing, isSelectionMode, onPreview }: { listing: Listing, isSelectionMode: boolean, onPreview: (l: Listing) => void }) => {
    return (
        <div className="flex items-start group relative">
            <AnimatePresence>
                {isSelectionMode && (
                    <motion.div
                        variants={checkboxVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mr-4 mt-24 shrink-0 absolute -left-12 z-20"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-colors">
                            <i className="fa-solid fa-check text-white"></i>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 min-w-0">
                <ListingCard listing={listing} onPreview={onPreview} />
            </div>
        </div>
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
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [counts, setCounts] = useState({ bedrooms: 0, beds: 0, bathrooms: 0 });
    const [selectedPreviewListing, setSelectedPreviewListing] = useState<Listing | null>(null);

    // API State
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const histogramData = [5, 15, 25, 40, 60, 85, 100, 95, 80, 65, 50, 35, 20, 15, 8];

    // Fetch Data (Flights & Hotels)
    React.useEffect(() => {
        const fetchData = async () => {
            // Wait a simulated delay to show skeleton (optional)
            if (!locationQuery && !dateQuery) {
                setListings(MOCK_LISTINGS);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Mock delay for realism
                await new Promise(r => setTimeout(r, 600));
                setListings(MOCK_LISTINGS);

                // In a real scenario, use services logic:
                /* 
                const [flightRes, hotelRes] = await Promise.all([...]);
                ... combine results ...
                */
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

    // Grouping Logic
    const sections = useMemo(() => {
        if (filteredListings.length === 0) return [];

        const categories = [
            {
                title: "Beliebt bei Gästen",
                icon: "fa-star",
                items: filteredListings.filter(l => l.rating >= 4.8)
            },
            {
                title: "Villen & Strand",
                icon: "fa-umbrella-beach",
                items: filteredListings.filter(l => l.propertyType === PropertyType.VILLA || (l.location.address.includes("Bali") || l.location.address.includes("Maldives")))
            },
            {
                title: "Städtereisen & Hotels",
                icon: "fa-city",
                items: filteredListings.filter(l => l.propertyType === PropertyType.HOTEL || l.propertyType === PropertyType.APARTMENT)
            },
            {
                title: "Natur & Cabins",
                icon: "fa-tree",
                items: filteredListings.filter(l => l.propertyType === PropertyType.CABIN || l.description.includes('Nature') || l.description.includes('Camping'))
            }
        ];

        // Removing duplicates logic could be complex, for now we let items appear in multiple relevant sections for fuller feed
        // OR we can deduplicate. Let's keep distinct references for now but maybe just filter unique IDs if we wanted strict separation.
        // User requested "nach kategorie und sectionen", usually implies strict separation or curated feeds.

        // Let's filter out empty categories
        return categories.filter(c => c.items.length > 0);

    }, [filteredListings]);


    return (
        <div className="min-h-screen bg-white">
            <Navbar
                onFilterClick={() => setIsFilterModalOpen(true)}
                forceCompact={true}
                onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
            />

            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10 text-left">
                <div className="flex items-end justify-between mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isLoading ? 'Suche Angebote...' : `${filteredListings.length} Ergebnisse`}
                        <span className="block text-slate-400 text-sm font-medium mt-1">Gefunden in {sections.length} Kategorien</span>
                    </h1>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-center">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-slate-100 rounded-[1.5rem] aspect-[20/19] mb-3"></div>
                                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sections.map((section, idx) => (
                            <section key={idx}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-lg">
                                        <i className={`fa-solid ${section.icon}`}></i>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{section.title}</h2>
                                    <div className="h-px bg-slate-100 flex-1 ml-4 mt-1"></div>
                                </div>

                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                                >
                                    {section.items.map(listing => (
                                        <SelectableListing
                                            key={`${section.title}-${listing.id}`}
                                            listing={listing}
                                            isSelectionMode={isSelectionMode}
                                            onPreview={setSelectedPreviewListing}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {filteredListings.length === 0 && (
                            <div className="text-center py-20">
                                <i className="fa-solid fa-ghost text-4xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 font-medium">Keine Ergebnisse gefunden.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* PREVIEW MODAL */}
            <AnimatePresence>
                {selectedPreviewListing && (
                    <ListingPreviewModal
                        listing={selectedPreviewListing}
                        onClose={() => setSelectedPreviewListing(null)}
                    />
                )}
            </AnimatePresence>

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
                                            const pos = (i / (histogramData.length - 1)) * 2000;
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
                                                left: `${(priceRange.min / 2000) * 100}%`,
                                                width: `${((priceRange.max - priceRange.min) / 2000) * 100}%`
                                            }}
                                        ></div>
                                        <input type="range" min="0" max="2000" step="50" value={priceRange.min} onChange={handleMinChange} className="z-30" />
                                        <input type="range" min="0" max="2000" step="50" value={priceRange.max} onChange={handleMaxChange} className="z-20" />
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
                                                    className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
                                                >
                                                    <i className="fa-solid fa-minus text-xl"></i>
                                                </button>
                                                <span className="w-10 text-center font-black text-3xl text-slate-900">{counts[item.key]}</span>
                                                <button
                                                    onClick={() => setCounts({ ...counts, [item.key]: counts[item.key] + 1 })}
                                                    className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
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
                                onClick={() => { setPriceRange({ min: 0, max: 2000 }); setCounts({ bedrooms: 0, beds: 0, bathrooms: 0 }); }}
                                className="text-sm font-black text-slate-900 underline underline-offset-[12px] decoration-2 hover:text-orange-600 transition-colors uppercase tracking-widest"
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
