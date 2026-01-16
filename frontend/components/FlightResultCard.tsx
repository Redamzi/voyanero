"use client";

import React from 'react';
import Link from 'next/link';

interface FlightSegment {
    departure: {
        iataCode: string;
        at: string;
    };
    arrival: {
        iataCode: string;
        at: string;
    };
    carrierCode: string;
    duration: string;
    numberOfStops: number;
}

interface FlightOffer {
    id: string;
    price: {
        total: string;
        currency: string;
    };
    itineraries: {
        duration: string;
        segments: FlightSegment[];
    }[];
    validatingAirlineCodes: string[];
}

interface FlightResultCardProps {
    offer: FlightOffer;
    cheapest?: boolean;
    fastest?: boolean;
    best?: boolean;
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({ offer, cheapest, fastest, best }) => {
    // Helper to format duration
    const formatDuration = (ptDuration: string) => {
        return ptDuration.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase();
    };

    // Helper to format time
    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to format Date
    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    };

    const outboundItinerary = offer.itineraries[0];
    const returnItinerary = offer.itineraries[1];

    const renderItineraryRow = (itinerary: typeof outboundItinerary, isReturn = false) => {
        if (!itinerary) return null;

        const firstSegment = itinerary.segments[0];
        const lastSegment = itinerary.segments[itinerary.segments.length - 1];
        const airlineCode = firstSegment.carrierCode;
        const stops = itinerary.segments.length - 1;

        return (
            <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                {/* Airline Logo & Date */}
                <div className="flex items-center gap-4 w-1/4">
                    <img
                        src={`http://pics.avs.io/60/60/${airlineCode}.png`}
                        alt={airlineCode}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=60&h=60&q=80';
                        }}
                    />
                    <div className="text-xs text-slate-500 font-medium">
                        {formatDate(firstSegment.departure.at)}
                    </div>
                </div>

                {/* Times & Route */}
                <div className="flex-1 flex items-center justify-between px-4">
                    <div className="text-left">
                        <div className="text-lg font-bold text-slate-900 leading-none">
                            {formatTime(firstSegment.departure.at)}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-1">
                            {firstSegment.departure.iataCode}
                        </div>
                    </div>

                    {/* Duration Line */}
                    <div className="flex-1 px-6 flex flex-col items-center">
                        <div className="text-xs text-slate-500 mb-1">
                            {formatDuration(itinerary.duration)}
                        </div>
                        <div className="w-full h-px bg-slate-300 relative">
                            {/* Dots for endpoints */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {/* Plane Icon */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                                <i className={`fa-solid fa-plane text-slate-300 text-[10px] ${isReturn ? 'rotate-180' : ''}`}></i>
                            </div>
                        </div>
                        <div className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${stops === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {stops === 0 ? 'Direkt' : `${stops} Stopp${stops > 1 ? 's' : ''}`}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 leading-none">
                            {formatTime(lastSegment.arrival.at)}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-1">
                            {lastSegment.arrival.iataCode}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const bookingUrl = `/book/flight?offerId=${offer.id}&context=${encodeURIComponent(JSON.stringify(offer))}`;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden relative group">
            {/* Badges */}
            <div className="absolute top-0 left-0 p-3 flex gap-2">
                {cheapest && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
                        Am billigsten
                    </span>
                )}
                {fastest && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
                        Am kürzesten
                    </span>
                )}
                {best && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
                        Empfohlen
                    </span>
                )}
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Flight Info Column */}
                <div className="flex-1 p-5 pr-8 pt-10 md:pt-5 border-b md:border-b-0 md:border-r border-slate-100">
                    {renderItineraryRow(outboundItinerary)}
                    {renderItineraryRow(returnItinerary, true)}
                </div>

                {/* Price & Action Column */}
                <div className="w-full md:w-48 bg-slate-50 p-5 flex flex-col justify-center items-center gap-4 shrink-0">
                    <div className="text-center">
                        <div className="text-sm text-slate-500 mb-0.5">Gesamtpreis</div>
                        <div className="text-2xl font-black text-slate-900">
                            {Math.ceil(parseFloat(offer.price.total))} €
                        </div>
                    </div>

                    <Link
                        href={bookingUrl}
                        className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-center transition-colors shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2 group-hover:bg-teal-600"
                    >
                        Auswählen
                        <i className="fa-solid fa-arrow-right text-sm"></i>
                    </Link>

                    <div className="text-[11px] text-slate-400 text-center">
                        Inkl. Steuern & Gebühren
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResultCard;
