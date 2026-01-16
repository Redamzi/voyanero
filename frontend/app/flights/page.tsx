"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FlightsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
                <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                    Flugsuche
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                    Finde die besten Flüge zu deinem Traumziel
                </p>

                {/* Travelpayouts Widget (iframe embed) */}
                <div className="w-full min-h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
                    <iframe
                        src="https://tpwdg.com/content?trs=353305&shmarker=575179&locale=de&curr=EUR&powered_by=true&border_radius=30&plain=true&color_button=%23000000ff&color_button_text=%23ffffff&color_border=%23000000ff&promo_id=4132&campaign_id=121"
                        width="100%"
                        height="600"
                        frameBorder="0"
                        style={{ border: 'none', minHeight: '600px' }}
                        title="Flugsuche"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
