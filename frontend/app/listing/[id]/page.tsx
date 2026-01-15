"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MOCK_LISTINGS } from '@/constants';
import { ListingType } from '@/types';

export default function ListingDetailPage() {
    const params = useParams();
    const listing = MOCK_LISTINGS.find(l => l.id === params.id);

    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const calendarRef = useRef<HTMLDivElement>(null);

    const isAffiliate = listing?.type === ListingType.AFFILIATE;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const subtotal = nights * (listing?.price || 0);
    const cleaningFee = 50;
    const total = subtotal + cleaningFee;

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isSelected = (checkIn && date.toDateString() === checkIn.toDateString()) || (checkOut && date.toDateString() === checkOut.toDateString());
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
                            setShowCalendar(false);
                        }
                    }}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
            ${isSelected ? 'bg-indigo-600 text-white' : ''}
            ${isInRange ? 'bg-indigo-50 text-indigo-600' : ''}
            ${!isSelected && !isInRange ? 'hover:bg-slate-100 text-slate-700' : ''}
          `}
                >
                    {d}
                </button>
            );
        }

        return (
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-slate-50 rounded-full">
                        <i className="fa-solid fa-chevron-left text-slate-400"></i>
                    </button>
                    <span className="font-black text-slate-900">{currentMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-slate-50 rounded-full">
                        <i className="fa-solid fa-chevron-right text-slate-400"></i>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase">{d}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    if (!listing) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Listing not found</h1>
                    <p className="text-slate-500">This listing doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                        {listing.title}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-600 text-sm font-medium">
                        <span className="flex items-center gap-1.5">
                            <i className="fa-solid fa-star text-[11px] text-black"></i>
                            <span className="text-black font-bold">{listing.rating}</span>
                            <span className="underline decoration-slate-300">({listing.reviewCount} reviews)</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 underline decoration-slate-300">
                            {listing.location.address}
                        </span>
                    </div>
                </div>

                {/* Image Gallery - Masonry Style */}
                <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[50vh] min-h-[400px] rounded-2xl overflow-hidden mb-12 relative group">
                    <div className="col-span-2 row-span-2 relative cursor-pointer">
                        <img src={listing.images[currentImageIndex]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-bold uppercase tracking-wider">
                            Gäste-Favorit
                        </div>
                    </div>
                    {listing.images.slice(1, 4).map((img, i) => (
                        <div key={i} className="relative cursor-pointer overflow-hidden">
                            <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="" onClick={() => setCurrentImageIndex(i + 1)} />
                        </div>
                    ))}
                    <div className="relative cursor-pointer overflow-hidden bg-slate-900">
                        {listing.images[4] && (
                            <img src={listing.images[4]} className="w-full h-full object-cover opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-500" alt="" onClick={() => setCurrentImageIndex(5)} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button className="bg-white border text-sm font-bold px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform">
                                <i className="fa-solid fa-grid mr-2"></i>
                                Alle Fotos
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 relative">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Host Info */}
                        <div className="flex items-center justify-between py-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    {isAffiliate ? `Flug mit ${listing.title.replace('Flug mit ', '')}` : `Entire villa hosted by Sarah`}
                                </h2>
                                <p className="text-slate-500">
                                    {listing.maxGuests} Gäste • {Math.ceil(listing.maxGuests / 2)} Schlafzimmer • 2 Badezimmer
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${listing.id}`} alt="Host" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1"><i className="fa-solid fa-medal text-lg text-slate-900"></i></div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">Superhost</h3>
                                    <p className="text-slate-500 text-sm">Superhosts sind erfahrene, hoch bewertete Gastgeber.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1"><i className="fa-solid fa-location-dot text-lg text-slate-900"></i></div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">Großartige Lage</h3>
                                    <p className="text-slate-500 text-sm">95% der letzten Gäste haben die Lage mit 5 Sternen bewertet.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-8 space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Über diese Unterkunft</h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {listing.description}
                                <br /><br />
                                Genießen Sie einen unvergesslichen Aufenthalt in dieser exklusiven Unterkunft. Perfekt gelegen, um die Umgebung zu erkunden, und ausgestattet mit allem Komfort, den Sie sich wünschen können.
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Was dieses Zuhause bietet</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {listing.amenities.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-slate-600">
                                        <i className="fa-solid fa-check text-slate-900 text-lg w-6"></i>
                                        <span className="text-base font-medium">{item}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 text-slate-600">
                                    <i className="fa-solid fa-wifi text-slate-900 text-lg w-6"></i>
                                    <span className="text-base font-medium">Highspeed WLAN</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <i className="fa-solid fa-car text-slate-900 text-lg w-6"></i>
                                    <span className="text-base font-medium">Kostenloser Parkplatz</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <i className="fa-solid fa-temperature-arrow-down text-slate-900 text-lg w-6"></i>
                                    <span className="text-base font-medium">Klimaanlage</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <i className="fa-solid fa-kitchen-set text-slate-900 text-lg w-6"></i>
                                    <span className="text-base font-medium">Voll ausgestattete Küche</span>
                                </div>
                            </div>
                            <button className="mt-8 border border-slate-900 text-slate-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                                Alle 35 Ausstattungsmerkmale anzeigen
                            </button>
                        </div>

                        {/* Map Section Placeholder */}
                        <div className="border-t border-slate-100 pt-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Wo du sein wirst</h3>
                            <p className="text-slate-500 mb-6">{listing.location.address}</p>
                            <div className="w-full h-[400px] bg-slate-100 rounded-2xl relative overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    alt="Map Placeholder"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-2xl animate-bounce">
                                    <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg ring-4 ring-white">
                                        <i className="fa-solid fa-house"></i>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded text-xs font-bold shadow-md text-slate-700">
                                    Google
                                </div>
                            </div>
                            <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                                Die genaue Lage wird nach der Buchung mitgeteilt. Wir befinden uns in einer ruhigen Nachbarschaft,
                                nur wenige Gehminuten von den besten Restaurants und Cafés entfernt.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-28">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-6">
                                <div className="flex items-end justify-between mb-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900">€{listing.price}</span>
                                        <span className="text-slate-500 text-sm"> Nacht</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 underline decoration-slate-300 cursor-pointer">
                                        <i className="fa-solid fa-star text-[10px]"></i>
                                        {listing.rating}
                                    </div>
                                </div>

                                {isAffiliate ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shrink-0">
                                                    <span className="text-white font-bold text-xs">B.</span>
                                                </div>
                                                <p className="text-slate-600 text-xs leading-relaxed">
                                                    Angebot bereitgestellt von <span className="font-bold text-slate-900">Booking.com</span>. Sichere Buchung & sofortige Bestätigung.
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href={listing.affiliateUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-500/30"
                                        >
                                            Verfügbarkeit prüfen
                                            <i className="fa-solid fa-arrow-right text-xs"></i>
                                        </a>
                                        <div className="text-center">
                                            <span className="text-xs text-slate-400">Sie werden weitergeleitet</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="border border-slate-300 rounded-xl overflow-hidden relative" ref={calendarRef}>
                                            <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                                                <div onClick={() => setShowCalendar(true)} className="p-3 cursor-pointer hover:bg-slate-50">
                                                    <label className="block text-[10px] font-bold uppercase text-slate-800">Check-in</label>
                                                    <div className="text-sm text-slate-600 truncate">{checkIn ? checkIn.toLocaleDateString() : 'Datum'}</div>
                                                </div>
                                                <div onClick={() => setShowCalendar(true)} className="p-3 cursor-pointer hover:bg-slate-50">
                                                    <label className="block text-[10px] font-bold uppercase text-slate-800">Check-out</label>
                                                    <div className="text-sm text-slate-600 truncate">{checkOut ? checkOut.toLocaleDateString() : 'Datum'}</div>
                                                </div>
                                            </div>
                                            <div className="p-3 hover:bg-slate-50 cursor-pointer">
                                                <label className="block text-[10px] font-bold uppercase text-slate-800">Gäste</label>
                                                <div className="text-sm text-slate-600">1 Gast</div>
                                            </div>

                                            {showCalendar && (
                                                <div className="absolute top-0 right-0 z-50 p-2 transform translate-x-4">
                                                    {/* Simple Calendar Overlay Placeholder - would be full calendar in real app */}
                                                    <div className="bg-white p-4 shadow-xl rounded-xl border border-slate-200 w-72">
                                                        {renderCalendar()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button className="w-full bg-[#E51D53] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#D41B4D] transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]">
                                            Reservieren
                                        </button>

                                        <div className="flex justify-between items-center pt-4">
                                            <span className="text-slate-600 underline">€{listing.price} x {nights} Nächte</span>
                                            <span className="text-slate-900">€{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-slate-600 underline">Reinigungsgebühr</span>
                                            <span className="text-slate-900">€{cleaningFee}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold text-base">
                                            <span>Gesamt</span>
                                            <span>€{total}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
