"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const BookingContent = () => {
    const searchParams = useSearchParams();
    const contextParam = searchParams.get('context');

    // All hooks MUST be declared before any conditional returns
    const [verificationError, setVerificationError] = React.useState<string | null>(null);
    const [confirmedPrice, setConfirmedPrice] = React.useState<unknown>(null);

    React.useEffect(() => {
        const verifyFlight = async () => {
            if (!flightData) return;
            
            try {
                setIsValidating(true);
                const { FlightService } = await import('../../../services/api');
                const result = await FlightService.confirmPrice(flightData);
                console.log("Price confirmed:", result);
            } catch (err) {
                console.error("Verification failed", err);
                setVerificationError("Dieser Tarif ist leider nicht mehr verfügbar (Preisänderung oder ausgebucht).");
            } finally {
                setIsValidating(false);
            }
        };

        verifyFlight();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextParam]);


    let flightData = null;
    try {
        if (contextParam) {
            flightData = JSON.parse(decodeURIComponent(contextParam));
        }
                setIsValidating(true);
                // Call verification API
                // Note: We need to import FlightService first. 
                // Using a dynamic import for now or adding it in separate step
                const { FlightService } = await import('../../../services/api');

                const result = await FlightService.confirmPrice(flightData);

                if (result) {
                    // Check if price changed? Amadeus returns updated offer.
                    setConfirmedPrice(result);
                }
            } catch (err) {
                console.error("Verification failed", err);
                setVerificationError("Dieser Tarif ist leider nicht mehr verfügbar (Preisänderung oder ausgebucht).");
            } finally {
                setIsValidating(false);
            }
        };

        verifyFlight();
    }, [contextParam]);

    // Show loading state while validating
    if (isValidating && flightData) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-bold text-slate-900">Flugpreis wird geprüft...</h2>
                <p className="text-slate-500">Wir checken die Live-Verfügbarkeit bei der Airline.</p>
            </div>
        );
    }

    // Show Error if invalid
    if (verificationError) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md p-8 bg-white rounded-3xl shadow-xl border border-red-100">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Nicht mehr verfügbar</h1>
                    <p className="text-slate-600 mb-8">{verificationError}</p>
                    <a href="/search?type=fluege" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                        Zurück zur Suche
                    </a>
                </div>
            </div>
        );
    }

    const airlineCode = flightData.validatingAirlineCodes?.[0];

    return (
        <div className="relative min-h-screen bg-slate-50 font-jakarta">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] opacity-20 transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-20 transform -translate-x-1/3 translate-y-1/3" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Flight Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Buchungsübersicht</h1>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {airlineCode ? (
                                        <img
                                            src={`http://pics.avs.io/200/200/${airlineCode}.png`}
                                            alt={airlineCode}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <i className="fa-solid fa-plane text-slate-400"></i>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {firstSegment?.departure?.iataCode} nach {lastSegment?.arrival?.iataCode}
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        {firstSegment?.departure?.at ? new Date(firstSegment.departure.at).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Segments */}
                            <div className="space-y-8 relative">
                                {/* Route visual line */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100" />

                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {segments.map((seg: any, idx: number) => {
                                    const depTime = new Date(seg.departure.at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                                    const arrTime = new Date(seg.arrival.at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                                    const duration = seg.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');

                                    return (
                                        <div key={idx} className="relative z-10">
                                            {/* Departure */}
                                            <div className="flex gap-6 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center shrink-0">
                                                    <div className="w-3 h-3 bg-slate-900 rounded-full" />
                                                </div>
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-black text-slate-900">{depTime}</span>
                                                        <span className="text-base font-bold text-slate-600">{seg.departure.iataCode}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">Terminal {seg.departure.terminal || '-'}</p>
                                                </div>
                                            </div>

                                            {/* Flight Info Card */}
                                            <div className="ml-16 mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fa-solid fa-plane text-slate-400"></i>
                                                        <span className="font-bold text-slate-700">{seg.carrierCode} {seg.number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fa-regular fa-clock text-slate-400"></i>
                                                        <span className="text-slate-600">{duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <i className="fa-solid fa-chair text-slate-400"></i>
                                                        <span className="text-slate-600">Economy</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrival */}
                                            <div className="flex gap-6">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white">
                                                    <i className="fa-solid fa-location-dot text-sm"></i>
                                                </div>
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-black text-slate-900">{arrTime}</span>
                                                        <span className="text-base font-bold text-slate-600">{seg.arrival.iataCode}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">Terminal {seg.arrival.terminal || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Price & Checkout */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-orange-500/5 border border-orange-100 sticky top-32">
                            <h3 className="text-xl font-black text-slate-900 mb-6">Preisdetails</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Ticketpreis (1 Erw.)</span>
                                    <span className="font-bold">{price} {currency}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Steuern & Gebühren</span>
                                    <span className="font-bold">Inklusive</span>
                                </div>
                                <div className="h-px bg-slate-100 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-900 font-bold">Gesamtbetrag</span>
                                    <span className="text-3xl font-black text-orange-600">{price} <span className="text-base font-bold text-slate-500">{currency}</span></span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/10">
                                Jetzt buchen
                            </button>

                            <p className="text-center text-xs text-slate-400 mt-4">
                                Durch Klick auf &quot;Jetzt buchen&quot; werden Sie zur Zahlung weitergeleitet.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function FlightBookingPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <BookingContent />
            </Suspense>
            <Footer />
        </>
    );
}
