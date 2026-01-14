"use client";

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FlightsPage() {
    useEffect(() => {
        // Load Travelpayouts widget script
        const script = document.createElement("script");
        script.async = true;
        script.src = 'https://emrldtp.cc/MzUzMzA1.js?t=353305';
        document.head.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

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

                {/* Widget container */}
                <div id="travelpayouts-widget" className="w-full min-h-[600px] bg-white rounded-2xl shadow-lg p-6">
                    {/* Widget will be injected here by the script */}
                </div>
            </div>

            <Footer />
        </div>
    );
}
