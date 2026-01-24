"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Types (Mirrored from FlightResultCard)
interface FlightSegment {
    departure: { iataCode: string; at: string; };
    arrival: { iataCode: string; at: string; };
    carrierCode: string;
    number: string;
    duration: string;
}

interface FlightOffer {
    id: string;
    price: { total: string; currency: string; };
    itineraries: {
        duration: string;
        segments: FlightSegment[];
    }[];
    validatingAirlineCodes: string[];
}

interface FlightDetailsModalProps {
    offer: FlightOffer;
    onClose: () => void;
}

const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({ offer, onClose }) => {

    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (iso: string) => new Date(iso).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatDuration = (pt: string) => pt.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase();

    // Helper to calculate layover time between segments
    const getLayover = (seg1: FlightSegment, seg2: FlightSegment) => {
        const arrival = new Date(seg1.arrival.at).getTime();
        const departure = new Date(seg2.departure.at).getTime();
        const diffMs = departure - arrival;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { text: `${diffHrs}h ${diffMins}min`, isLong: diffHrs >= 2 };
    };

    return (
        <div className="fixed inset-0 z-[1200] bg-slate-900/40 backdrop-blur-sm flex justify-end">
            {/* Background click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-over Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <header className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-4 shrink-0">
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-arrow-left text-slate-800 text-lg"></i>
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-900 text-lg">Flugdetails</h2>
                        <p className="text-xs text-slate-500">Gesamtreisezeit & Umstiege</p>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {offer.itineraries.map((itinerary, i) => (
                        <div key={i}>
                            {/* Direction Header */}
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                                    {i === 0 ? 'Hinflug' : 'Rückflug'}
                                </span>
                                <h3 className="font-black text-2xl text-slate-900">
                                    {itinerary.segments[0].departure.iataCode}
                                    <span className="mx-2 text-slate-400">→</span>
                                    {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold text-xs uppercase">
                                        {formatDate(itinerary.segments[0].departure.at)}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDuration(itinerary.duration)}</span>
                                </div>
                            </div>

                            {/* Timeline Segments */}
                            <div className="relative pl-4 space-y-0">
                                {/* Vertical Line Layer */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-300 z-0"></div>

                                {itinerary.segments.map((segment, segIdx) => {
                                    const nextSegment = itinerary.segments[segIdx + 1];
                                    const layover = nextSegment ? getLayover(segment, nextSegment) : null;

                                    return (
                                        <div key={segIdx} className="relative z-10 pb-8 last:pb-0">
                                            {/* Flight Card */}
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 relative">
                                                {/* Airline Header */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <img src={`https://pics.avs.io/60/60/${segment.carrierCode}.png`} alt="" className="w-8 h-8 object-contain" />
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">Airline {segment.carrierCode}</div>
                                                            <div className="text-xs text-slate-400">Flug {segment.carrierCode}{segment.number}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Timeline Inside Card */}
                                                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-8">
                                                    {/* Departure */}
                                                    <div className="flex flex-col items-center pt-1">
                                                        <div className="w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white"></div>
                                                        <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-xl text-slate-900">{formatTime(segment.departure.at)}</div>
                                                        <div className="text-sm font-medium text-slate-600">Flughafen {segment.departure.iataCode}</div>
                                                    </div>

                                                    {/* Duration Info (Middle) */}
                                                    <div className="flex flex-col items-center justify-center">
                                                        <i className="fa-regular fa-clock text-slate-300 text-xs"></i>
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-400 py-2">
                                                        Reisezeit: {formatDuration(segment.duration)}
                                                    </div>

                                                    {/* Arrival */}
                                                    <div className="flex flex-col items-center pb-1">
                                                        <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                                                        <div className="w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-xl text-slate-900">{formatTime(segment.arrival.at)}</div>
                                                        <div className="text-sm font-medium text-slate-600">Flughafen {segment.arrival.iataCode}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Layover Info */}
                                            {layover && (
                                                <div className="ml-0 mb-6 pl-4 border-l-2 border-dashed border-slate-300 py-2">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${layover.isLong ? 'bg-slate-900 text-white' : 'bg-orange-100 text-orange-700'}`}>
                                                        <i className="fa-solid fa-hourglass-half"></i>
                                                        {layover.text} Aufenthalt
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 ml-1">Wechsel des Flugzeugs in {segment.arrival.iataCode}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </main>

                {/* Footer Action */}
                <footer className="p-6 bg-white border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-sm">Gesamtpreis</span>
                        <span className="text-2xl font-black text-slate-900">{Math.ceil(parseFloat(offer.price.total))} €</span>
                    </div>
                    <a
                        href={`/book/flight?offerId=${offer.id}&context=${encodeURIComponent(JSON.stringify(offer))}`}
                        className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                    >
                        Auswählen
                    </a>
                </footer>
            </motion.div>
        </div>
    );
};

export default FlightDetailsModal;
