"use client";

import React from 'react';

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

const FlightResultCard: React.FC<FlightResultCardProps & { onClick?: () => void }> = ({ offer, cheapest, onClick }) => {
    // Helper to format duration
    const formatDuration = (ptDuration: string) => {
        return ptDuration.replace('PT', '').replace('H', ' Std. ').replace('M', ' Min.').toLowerCase();
    };

    // Helper to format time
    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to format date
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
    };

    const outboundItinerary = offer.itineraries[0];
    const returnItinerary = offer.itineraries[1];

    // Calculate nights for the middle badge
    const nightsInDest = (() => {
        if (!returnItinerary) return 0;
        const arrivalOut = new Date(outboundItinerary.segments[outboundItinerary.segments.length - 1].arrival.at);
        const depReturn = new Date(returnItinerary.segments[0].departure.at);
        const diff = depReturn.getTime() - arrivalOut.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    })();

    const renderItineraryNew = (itinerary: typeof outboundItinerary, isReturn = false) => {
        if (!itinerary) return null;

        const firstSegment = itinerary.segments[0];
        const lastSegment = itinerary.segments[itinerary.segments.length - 1];
        const airlineCode = firstSegment.carrierCode;
        const stops = itinerary.segments.length - 1;

        const depTime = formatTime(firstSegment.departure.at);
        const arrTime = formatTime(lastSegment.arrival.at);
        const durationShort = formatDuration(itinerary.duration).replace(' std. ', 'h ').replace(' min.', 'm');

        return (
            <div className="py-2">
                {/* Header: Date & Label */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-slate-500 font-medium">
                        {formatDate(firstSegment.departure.at)} • {isReturn ? 'Rückreise' : 'Hinreise'}
                    </span>
                    {/* Optional Pin (Mock) */}
                    <i className="fa-solid fa-thumbtack text-slate-300 ml-auto text-xs opacity-0 md:opacity-100"></i>
                </div>

                {/* Flight Row */}
                <div className="flex items-center justify-between">
                    {/* Departure */}
                    <div className="text-left w-1/4">
                        <div className="text-xl font-bold text-slate-900 leading-none">{depTime}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">{firstSegment.departure.iataCode}</div>
                    </div>

                    {/* Center: Duration Pill & Airline */}
                    <div className="flex-1 px-2 flex flex-col items-center">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 mb-1">
                            <span className="text-xs font-bold text-slate-600">{durationShort}</span>
                            <img
                                src={`https://pics.avs.io/60/60/${airlineCode}.png`}
                                alt={airlineCode}
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            {stops === 0 ? 'Direkt' : `${stops} Stopp${stops > 1 ? 's' : ''}`}
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-right w-1/4">
                        <div className="text-xl font-bold text-slate-900 leading-none">{arrTime}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">{lastSegment.arrival.iataCode}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.99] relative overflow-hidden"
        >
            {/* Guarantee Tag (Top Right - Optional / Mocked) */}
            {cheapest && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">
                    BESTER PREIS
                </div>
            )}

            {/* Outbound */}
            {renderItineraryNew(outboundItinerary, false)}

            {/* Divider with Badge */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-slate-200"></div>
                </div>
                {returnItinerary && nightsInDest > 0 && (
                    <div className="relative flex justify-center">
                        <span className="bg-white border border-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                            {nightsInDest} Nächte am Ziel
                        </span>
                    </div>
                )}
            </div>

            {/* Return */}
            {returnItinerary && renderItineraryNew(returnItinerary, true)}

            {/* Footer: Guarantee & Price */}
            <div className="mt-4 pt-3 border-t border-slate-50 bg-emerald-50/50 -mx-4 -mb-4 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <i className="fa-solid fa-shield-halved"></i>
                        Guarantee verfügbar
                    </span>
                    <span className="text-xs font-bold text-emerald-700">+18 €</span>
                </div>

                <div className="flex items-end justify-between">
                    {/* Left: Baggage (Static Mock from Screenshot) */}
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-suitcase text-xs"></i>
                            <span className="text-xs font-medium">1</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-person-walking-luggage text-xs text-slate-300"></i>
                            <span className="text-xs font-medium text-slate-300">0</span>
                        </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right">
                        <div className="text-xl font-black text-slate-900 leading-none">
                            {Math.ceil(parseFloat(offer.price.total)).toLocaleString('de-DE')} €
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FlightResultCard;


