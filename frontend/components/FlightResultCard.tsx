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

const FlightResultCard: React.FC<FlightResultCardProps & { onClick?: () => void }> = ({ offer, cheapest, fastest, best, onClick }) => {
    // Helper to format duration
    const formatDuration = (ptDuration: string) => {
        return ptDuration.replace('PT', '').replace('H', ' Std. ').replace('M', ' Min.').toLowerCase();
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

    const renderItinerarySimple = (itinerary: typeof outboundItinerary) => {
        if (!itinerary) return null;

        const firstSegment = itinerary.segments[0];
        const lastSegment = itinerary.segments[itinerary.segments.length - 1];
        const airlineCode = firstSegment.carrierCode;
        const stops = itinerary.segments.length - 1;

        // Calculate arrival date diff (mock logic for +1)
        const depDate = new Date(firstSegment.departure.at).getDate();
        const arrDate = new Date(lastSegment.arrival.at).getDate();
        const nextDay = arrDate !== depDate;

        return (
            <div className="flex items-start justify-between py-2">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://pics.avs.io/60/60/${airlineCode}.png`}
                        alt={airlineCode}
                        className="w-8 h-8 object-contain rounded-sm"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x60?text=✈️'; }}
                    />
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-slate-900">
                                {formatTime(firstSegment.departure.at)}
                            </span>
                            <span className="text-slate-400 text-xs">-</span>
                            <span className="text-base font-bold text-slate-900">
                                {formatTime(lastSegment.arrival.at)}
                            </span>
                            {nextDay && <sup className="text-xs font-bold text-slate-500 ml-0.5">+1</sup>}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                            {firstSegment.departure.iataCode} - {lastSegment.arrival.iataCode}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`text-xs font-bold ${stops === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stops === 0 ? 'Direktflug' : `${stops} Zwischenstopp${stops > 1 ? 's' : ''}`}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                        {formatDuration(itinerary.duration)}
                    </div>
                </div>
            </div>
        );
    };

    const bookingUrl = `/book/flight?offerId=${offer.id}&context=${encodeURIComponent(JSON.stringify(offer))}`;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
        >
            {/* Context Header: Airline Name & Badges */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                        {/* Try to get airline name from code or fallback */}
                        {offer.validatingAirlineCodes[0]} Airlines
                    </span>
                </div>

                <div className="flex gap-2">
                    {cheapest && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Am günstigsten</span>}
                    {fastest && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Am kürzesten</span>}
                    {best && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Tipp</span>}
                </div>
            </div>

            {/* Itineraries */}
            <div className="space-y-4 mb-5 border-b border-slate-50 pb-4">
                {renderItinerarySimple(outboundItinerary)}
                {returnItinerary && renderItinerarySimple(returnItinerary)}
            </div>

            {/* Footer: Price */}
            <div className="flex items-end justify-end">
                <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 leading-none">
                        {Math.ceil(parseFloat(offer.price.total)).toLocaleString('de-DE')} €
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">
                        pro Person
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResultCard;


