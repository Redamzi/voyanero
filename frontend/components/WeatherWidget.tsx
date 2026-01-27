"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import BentoCard from './BentoCard';

// 1. Safe/Public Data Sources (OpenMeteo for Weather)
// No API Key required, completely open.
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export interface CityData {
    name: string;
    country: string;
    lat: number;
    lon: number;
    image: string;
    desc: string;
}

interface WeatherWidgetProps {
    city: CityData;
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);

    // Fetch weather when city changes
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(`${WEATHER_API}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`);
                const data = await res.json();
                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code
                });
            } catch (err) {
                console.error("Weather fetch failed", err);
            }
        };

        fetchWeather();
    }, [city]);

    // Icon & Label Mapping (WMO Weather Codes)
    const getWeatherInfo = (code: number) => {
        if (code === 0) return { icon: "fa-sun", label: "Klar", color: "text-amber-400" };
        if (code >= 1 && code <= 3) return { icon: "fa-cloud-sun", label: "Bewölkt", color: "text-blue-200" };
        if (code >= 45 && code <= 48) return { icon: "fa-smog", label: "Nebel", color: "text-slate-300" };
        if (code >= 51 && code <= 67) return { icon: "fa-cloud-rain", label: "Regen", color: "text-blue-400" };
        if (code >= 71 && code <= 77) return { icon: "fa-snowflake", label: "Schnee", color: "text-white" };
        if (code >= 95) return { icon: "fa-bolt", label: "Gewitter", color: "text-purple-400" };
        return { icon: "fa-cloud", label: "Wetter", color: "text-white" };
    };

    const weatherInfo = weather ? getWeatherInfo(weather.code) : { icon: "fa-circle-notch fa-spin", label: "Laden...", color: "text-white" };

    // 4. Mouse Move Animation (Parallax)
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Background movement (opposite to rotation for depth)
    const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10%", "10%"]);
    const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10%", "10%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
                rotateX,
                rotateY
            }}
            className="h-full w-full"
        >
            <BentoCard className="h-full !p-0 relative overflow-hidden group !bg-transparent !border-0 !shadow-none">
                {/* Super-Subtle-Glass Hintergrund */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-none"></div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full px-3 py-2 flex items-center justify-between text-white">
                    {/* Linke Seite: Temperatur & Stadt (Linksbündig) */}
                    <div className="flex flex-col items-start justify-center gap-0 overflow-hidden flex-1">
                        <motion.div
                            key={weather?.temp || "loading"}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-start"
                        >
                            <span className="text-5xl font-[900] tracking-tighter leading-none drop-shadow-md filter">
                                {weather ? `${weather.temp}°` : '--'}
                            </span>
                        </motion.div>

                        <motion.div
                            key={city.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="w-full"
                        >
                            <h3 className="text-[11px] font-[800] leading-tight drop-shadow-md uppercase tracking-wider opacity-90 whitespace-nowrap text-left mt-0.5">{city.name}, {city.country.substring(0, 2)}</h3>
                        </motion.div>
                    </div>

                    {/* Rechte Seite: Wetter-Icon (Rechtsbündig) */}
                    <div className={`w-10 h-10 shrink-0 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-none ml-2 ${weatherInfo.color}`}>
                        <i className={`fa-solid ${weatherInfo.icon} text-sm drop-shadow-sm`}></i>
                    </div>
                </div>
            </BentoCard>
        </motion.div>
    );
}
