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
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Image Gallery */}
                <div className="grid grid-cols-4 gap-4 mb-10 rounded-3xl overflow-hidden">
                    <div className="col-span-2 row-span-2 relative aspect-square">
                        <img src={listing.images[currentImageIndex]} className="w-full h-full object-cover" alt="" />
                    </div>
                    {listing.images.slice(1, 5).map((img, i) => (
                        <div key={i} className="aspect-square relative cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentImageIndex(i + 1)}>
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 space-y-10 text-left">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{listing.title}</h1>
                            <p className="text-slate-500 text-lg flex items-center font-medium">
                                <i className="fa-solid fa-location-dot text-indigo-500 mr-2"></i>
                                {listing.location.address}
                            </p>
                        </div>

                        <div className="flex items-center gap-12 py-8 border-y border-slate-100">
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-slate-900">{listing.rating}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Rating</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-slate-900">{listing.reviewCount}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Reviews</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-slate-900">{listing.maxGuests}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Guests</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">About this place</h3>
                            <p className="text-slate-500 leading-relaxed text-lg font-medium">{listing.description}</p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Amenities</h3>
                            <div className="grid grid-cols-2 gap-y-4">
                                {listing.amenities.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600 font-semibold text-base">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                            <i className="fa-solid fa-check text-[10px] text-indigo-600"></i>
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-10 space-y-8">
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-4xl font-black text-slate-900">€{listing.price}</span>
                                    <span className="text-slate-400 font-medium ml-1">/ night</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-black text-slate-900">
                                    <i className="fa-solid fa-star text-amber-400"></i>
                                    {listing.rating}
                                </div>
                            </div>

                            {isAffiliate ? (
                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                            This listing is provided by our partner <span className="text-slate-900 font-bold">Booking.com</span>. You will be redirected to their secure platform to complete your reservation.
                                        </p>
                                    </div>
                                    <a
                                        href={listing.affiliateUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        View on Booking.com
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="relative" ref={calendarRef}>
                                        <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-[1.5rem] overflow-hidden">
                                            <div
                                                onClick={() => setShowCalendar(true)}
                                                className="bg-white p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                                            >
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check-in</label>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-black text-slate-900">
                                                        {checkIn ? checkIn.toLocaleDateString('de-DE') : 'Select date'}
                                                    </span>
                                                    <i className={`fa-regular fa-calendar ${showCalendar ? 'text-indigo-600' : 'text-slate-300'} group-hover:text-indigo-500 transition-colors`}></i>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setShowCalendar(true)}
                                                className="bg-white p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                                            >
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check-out</label>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-black text-slate-900">
                                                        {checkOut ? checkOut.toLocaleDateString('de-DE') : 'Select date'}
                                                    </span>
                                                    <i className={`fa-regular fa-calendar ${showCalendar ? 'text-indigo-600' : 'text-slate-300'} group-hover:text-indigo-500 transition-colors`}></i>
                                                </div>
                                            </div>
                                        </div>

                                        {showCalendar && (
                                            <div className="absolute top-full left-0 right-0 z-50 mt-4 flex justify-center animate-in fade-in slide-in-from-top-2">
                                                {renderCalendar()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full bg-[#4F46E5] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98]">
                                            Reserve Now
                                        </button>
                                        <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                            You won't be charged yet
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between text-sm font-medium text-slate-500">
                                            <span>€{listing.price} x {nights} night{nights !== 1 ? 's' : ''}</span>
                                            <span className="text-slate-900 font-bold">€{subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium text-slate-500">
                                            <span>Cleaning fee</span>
                                            <span className="text-slate-900 font-bold">€{cleaningFee}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black text-slate-900 pt-3">
                                            <span>Total</span>
                                            <span>€{total}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
