"use client";

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '@/components/ListingCard';
import ListingPreviewModal from '@/components/ListingPreviewModal';
import FlightResultCard from '@/components/FlightResultCard';
import FilterSidebar from '@/components/FilterSidebar';
import DateStrip from '@/components/DateStrip';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Listing, ListingType, PropertyType } from '@/types';
import { FlightService, TransferService } from '@/services/api';
import { HotelService } from '@/services/hotelService';

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
    // Don't use preview for affiliate listings - redirect directly
    const shouldUsePreview = listing.type !== ListingType.AFFILIATE;

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
                <ListingCard listing={listing} onPreview={shouldUsePreview ? onPreview : undefined} />
            </div>
        </div>
    );
};

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchType = searchParams.get('type') || 'reisen';
    const locationQuery = searchParams.get('location') || '';
    const originQuery = searchParams.get('origin') || '';
    const destinationQuery = searchParams.get('destination') || '';

    const getValidFutureDate = (dateStr: string | null) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!dateStr) return new Date().toISOString().split('T')[0];
        const date = new Date(dateStr);
        if (isNaN(date.getTime()) || date < today) {
            return new Date().toISOString().split('T')[0];
        }
        return dateStr;
    };

    const dateQuery = getValidFutureDate(searchParams.get('checkIn') || searchParams.get('date'));
    const returnDateQuery = searchParams.get('checkOut') || undefined;

    // Guest params
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');

    // UI State
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPreviewListing, setSelectedPreviewListing] = useState<Listing | null>(null);

    // Legacy Filter State (for Hotels/Mixed)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [counts, setCounts] = useState({ bedrooms: 0, beds: 0, bathrooms: 0 });
    const histogramData = [5, 15, 25, 40, 60, 85, 100, 95, 80, 65, 50, 35, 20, 15, 8];


    // API State
    const [listings, setListings] = useState<Listing[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [flightOffers, setFlightOffers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);

    // Flight Filters
    const [flightFilters, setFlightFilters] = useState({
        stops: 'Alle' as string | null,
        maxPrice: null as number | null,
        airlines: [] as string[]
    });
    const [sortOption, setSortOption] = useState<'best' | 'cheapest' | 'fastest'>('best');

    // Fetch Data (Flights & Hotels)
    React.useEffect(() => {
        const fetchData = async () => {
            if (!locationQuery && !dateQuery && !destinationQuery) {
                setListings([]);
                setError("Bitte gib ein Reiseziel ein, um Angebote zu finden.");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                let combinedListings: Listing[] = [];

                // Fetch based on search type
                if (searchType === 'reisen') {
                    // Legacy Logic for Mixed Search
                    const [flightRes, hotelRes] = await Promise.all([
                        FlightService.searchFlights({
                            origin: "MUC",
                            destination: locationQuery,
                            date: dateQuery || new Date().toISOString().split('T')[0],
                            adults, children, infants
                        }),
                        HotelService.searchHotels(locationQuery),
                    ]);

                    if (flightRes && Array.isArray(flightRes) && flightRes.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const flightListings: Listing[] = flightRes.map((flight: any) => {
                            const airlineCode = flight.validatingAirlineCodes?.[0];
                            return {
                                id: flight.id,
                                title: `Flug mit ${airlineCode || 'Airline'}`,
                                description: 'Flugdaten',
                                type: ListingType.AFFILIATE,
                                propertyType: PropertyType.HOTEL,
                                price: parseFloat(flight.price?.total || '0'),
                                location: { address: 'Flight', lat: 0, lng: 0 },
                                images: airlineCode ? [`http://pics.avs.io/200/200/${airlineCode}.png`] : [],
                                amenities: [],
                                rating: 4.5,
                                reviewCount: 20,
                                maxGuests: adults + children,
                                affiliateUrl: `/book/flight?offerId=${flight.id}&context=${encodeURIComponent(JSON.stringify(flight))}`
                            };
                        });
                        combinedListings = [...combinedListings, ...flightListings];
                    }
                    if (hotelRes && hotelRes.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hotelListings: Listing[] = hotelRes.map((hotel: any) => ({
                            id: hotel.id,
                            title: hotel.title,
                            description: hotel.description,
                            type: ListingType.AFFILIATE,
                            propertyType: PropertyType.HOTEL,
                            price: hotel.price,
                            location: { address: hotel.location?.address || 'Unknown', lat: 0, lng: 0 },
                            images: hotel.image ? [hotel.image] : [],
                            amenities: hotel.amenities || [],
                            rating: hotel.rating,
                            reviewCount: hotel.reviews,
                            maxGuests: 2,
                            affiliateUrl: hotel.deepLink
                        }));
                        combinedListings = [...combinedListings, ...hotelListings];
                    }
                    setListings(combinedListings);

                } else if (searchType === 'fluege') {
                    // Flight Redesign Logic
                    const flightRes = await FlightService.searchFlights({
                        origin: originQuery || "MUC",
                        destination: destinationQuery || locationQuery,
                        date: dateQuery || new Date().toISOString().split('T')[0],
                        return_date: returnDateQuery,
                        adults, children, infants
                    });

                    if (flightRes && Array.isArray(flightRes)) {
                        setFlightOffers(flightRes);

                        // Extract airlines for filter
                        const airlines = new Set<string>();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        flightRes.forEach((f: any) => {
                            f.validatingAirlineCodes?.forEach((code: string) => airlines.add(code));
                        });
                        setAvailableAirlines(Array.from(airlines));

                        // Set initial max price for filter slider if not set
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const maxP = Math.max(...flightRes.map((f: any) => parseFloat(f.price.total)));
                        if (!flightFilters.maxPrice) {
                            setFlightFilters(prev => ({ ...prev, maxPrice: Math.ceil(maxP) }));
                        }
                    } else {
                        setFlightOffers([]);
                    }
                } else if (searchType === 'transfer') {
                    const transferRes = await TransferService.searchTransfers({
                        startLocationCode: originQuery || 'LHR',
                        endLocationCode: destinationQuery || 'CDG',
                        startDateTime: dateQuery ? new Date(dateQuery).toISOString() : new Date().toISOString(),
                        passengers: adults + children || 1
                    });
                    if (transferRes && Array.isArray(transferRes)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const transferListings: Listing[] = transferRes.map((offer: any, index: number) => ({
                            id: offer.id || `transfer-${index}`,
                            title: `Transfer (${offer.transferType})`,
                            description: `Fahrzeug: ${offer.vehicle?.category || 'Standard'}`,
                            type: ListingType.AFFILIATE,
                            propertyType: PropertyType.HOTEL,
                            price: parseFloat(offer.price?.total || '0'),
                            location: { address: 'Transfer', lat: 0, lng: 0 },
                            images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'],
                            amenities: [offer.vehicle?.category],
                            rating: 4.8,
                            reviewCount: 50,
                            maxGuests: offer.vehicle?.passengerCapacity || 4,
                            affiliateUrl: '#'
                        }));
                        setListings(transferListings);
                    }
                } else if (searchType === 'unterkunft') {
                    const hotelRes = await HotelService.searchHotels(locationQuery);
                    if (hotelRes && hotelRes.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hotelListings: Listing[] = hotelRes.map((hotel: any) => ({
                            id: hotel.id,
                            title: hotel.title,
                            description: hotel.description,
                            type: ListingType.AFFILIATE,
                            propertyType: PropertyType.HOTEL,
                            price: hotel.price,
                            location: { address: hotel.location?.address || 'Unknown', lat: 0, lng: 0 },
                            images: hotel.image ? [hotel.image] : [],
                            amenities: hotel.amenities || [],
                            rating: hotel.rating,
                            reviewCount: hotel.reviews,
                            maxGuests: 2,
                            affiliateUrl: hotel.deepLink
                        }));
                        setListings(hotelListings);
                    }
                }

            } catch (err) {
                console.error("Data fetch failed", err);
                setError("Daten konnten nicht geladen werden.");
                setListings([]);
                setFlightOffers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationQuery, dateQuery, destinationQuery, adults, children, infants, searchType]);

    // Derived Flight State
    const filteredFlights = useMemo(() => {
        let res = [...flightOffers];

        // Filter by Stops
        if (flightFilters.stops && flightFilters.stops !== 'Alle') {
            res = res.filter(offer => {
                const stops = offer.itineraries[0].segments.length - 1;
                if (flightFilters.stops === 'Direkt') return stops === 0;
                if (flightFilters.stops === 'Max. 1 Stopp') return stops <= 1;
                if (flightFilters.stops === 'Max. 2 Stopps') return stops <= 2;
                return true;
            });
        }

        // Filter by Price
        if (flightFilters.maxPrice) {
            res = res.filter(offer => parseFloat(offer.price.total) <= flightFilters.maxPrice!);
        }

        // Filter by Airline
        if (flightFilters.airlines.length > 0) {
            res = res.filter(offer =>
                offer.validatingAirlineCodes.some((code: string) => flightFilters.airlines.includes(code))
            );
        }

        // Sorting
        res.sort((a, b) => {
            const priceA = parseFloat(a.price.total);
            const priceB = parseFloat(b.price.total);
            // const durationA = a.itineraries[0].duration; 

            if (sortOption === 'cheapest') return priceA - priceB;
            // Best = Mix of price and duration (mock logic: cheaper is better)
            if (sortOption === 'best') return priceA - priceB;
            return 0;
        });

        return res;
    }, [flightOffers, flightFilters, sortOption]);


    const handleDateSelect = (newDate: Date) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('checkIn', newDate.toISOString().split('T')[0]);
        params.set('date', newDate.toISOString().split('T')[0]); // Ensure both are set just in case
        router.push(`?${params.toString()}`);
    };

    // Generic groupings for non-flight views
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

    const sections = useMemo(() => {
        if (searchType === 'fluege') return []; // Flights use new layout
        if (listings.length === 0) return [];
        return [
            {
                title: "Ergebnisse",
                icon: "fa-list",
                items: filteredListings
            }
        ];
    }, [listings, searchType, filteredListings]);


    // RENDER: FLIGHTS (KIWI STYLE)
    if (searchType === 'fluege') {
        const minPrice = flightOffers.length > 0 ? Math.min(...flightOffers.map(f => parseFloat(f.price.total))) : 0;
        const maxPrice = flightOffers.length > 0 ? Math.max(...flightOffers.map(f => parseFloat(f.price.total))) : 1000;

        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar
                    onFilterClick={() => setIsFilterModalOpen(true)}
                    forceCompact={true}
                    onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
                />

                <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    {/* Date Strip */}
                    <div className="mb-8">
                        <DateStrip
                            currentDate={dateQuery ? new Date(dateQuery) : new Date()}
                            onDateSelect={handleDateSelect}
                            prices={{}} // Mock prices could go here
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <FilterSidebar
                                filters={flightFilters}
                                onFilterChange={setFlightFilters}
                                minPrice={Math.floor(minPrice)}
                                maxPrice={Math.ceil(maxPrice)}
                                availableAirlines={availableAirlines}
                            />
                        </aside>

                        {/* Main Results */}
                        <div className="flex-1 min-w-0">
                            {/* Sort Tabs */}
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                {[
                                    { id: 'best', label: 'Beste Ergebnisse', icon: 'fa-star' },
                                    { id: 'cheapest', label: 'Am billigsten', icon: 'fa-tag' },
                                    { id: 'fastest', label: 'Am kürzesten', icon: 'fa-stopwatch' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        onClick={() => setSortOption(opt.id as any)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all
                                            ${sortOption === opt.id
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                            }`}
                                    >
                                        <i className={`fa-solid ${opt.icon} ${sortOption === opt.id ? 'text-orange-400' : 'text-slate-400'}`}></i>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white h-48 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
                                    {error}
                                </div>
                            )}

                            {/* Results List */}
                            <div className="space-y-4">
                                {filteredFlights.map((offer, idx) => (
                                    <FlightResultCard
                                        key={offer.id}
                                        offer={offer}
                                        cheapest={idx === 0 && sortOption === 'cheapest'}
                                        best={idx === 0 && sortOption === 'best'}
                                    />
                                ))}

                                {!isLoading && filteredFlights.length === 0 && !error && (
                                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <i className="fa-solid fa-plane-slash text-slate-400 text-2xl"></i>
                                        </div>
                                        <h3 className="text-slate-900 font-bold text-lg mb-1">Keine Flüge gefunden</h3>
                                        <p className="text-slate-500">Versuche deine Filter anzupassen oder wähle ein anderes Datum.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }


    // RENDER: DEFAULT (HOTELS, TRANSFERS, MIXED)
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
                        {isLoading ? 'Suche Angebote...' : `${listings.length} Ergebnisse`}
                    </h1>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-center">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-slate-100 rounded-[1.5rem] aspect-[20/19] mb-3"></div>
                                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {sections.map((section, idx) => (
                            <section key={idx}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
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

                        {listings.length === 0 && (
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
                                {listings.length} Ergebnisse anzeigen
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
