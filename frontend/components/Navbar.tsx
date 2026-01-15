"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '../types';

import { usePathname } from 'next/navigation';

interface NavbarProps {
    user?: User | null;
    onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    React.useEffect(() => {
        const handleScroll = () => {
            const threshold = isHome ? 660 : 50;
            setIsScrolled(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    return (
        <nav className={`border-b border-slate-100 bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-sm py-2' : 'py-0'}`}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform duration-300">
                                <i className="fa-solid fa-paper-plane text-lg"></i>
                            </div>
                            <span className="hidden lg:block text-xl font-black tracking-tighter text-slate-900 group-hover:text-rose-500 transition-colors">VOYANERO</span>
                        </Link>
                    </div>

                    {/* Center: Morphing Search Bar */}
                    <div className="hidden md:flex flex-1 justify-center px-8 relative h-full items-center">
                        {/* STATE 1: Links (Default) */}
                        <div className={`absolute transition-all duration-500 ease-in-out transform ${isScrolled ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                            <div className="flex items-center gap-1 p-1 bg-slate-50/50 rounded-full border border-slate-100">
                                <Link href="/" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-900 bg-white shadow-sm ring-1 ring-black/5">
                                    Entdecken
                                </Link>
                                <Link href="/search" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all">
                                    Suchen
                                </Link>
                                <Link href="/ai-concierge" className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    AI Concierge
                                </Link>
                            </div>
                        </div>

                        {/* STATE 2: Compact Search Pill (Scrolled) */}
                        <div className={`absolute w-full max-w-lg transition-all duration-500 ease-in-out transform ${isScrolled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 -translate-y-4 pointer-events-none'}`}>
                            <div className="bg-white rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all p-2 pl-6 flex items-center justify-between cursor-pointer border-opacity-100">
                                <div className="text-sm font-bold text-slate-900 truncate pr-4 border-r border-slate-200">Irgendwo</div>
                                <div className="text-sm font-bold text-slate-900 truncate px-4 border-r border-slate-200">Jederzeit</div>
                                <div className="text-sm font-medium text-slate-500 px-4">Gäste hinzufügen</div>
                                <div className="w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center text-white shrink-0">
                                    <i className="fa-solid fa-magnifying-glass text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                        <Link href="/host" className="text-sm font-bold text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-full transition-colors">
                            Als Gastgeber starten
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 border border-slate-200 rounded-full p-1 pl-4 hover:shadow-md transition-all duration-300 group bg-white"
                            >
                                <i className="fa-solid fa-bars text-slate-400 group-hover:text-slate-600"></i>
                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white relative overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-user text-xs"></i>
                                    )}
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {user ? (
                                        <>
                                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link href="/dashboard" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                    Dashboard
                                                </Link>
                                                <Link href="/trips" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                    Meine Reisen
                                                </Link>
                                                <Link href="/wishlist" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                    Merkliste
                                                </Link>
                                                <div className="h-px bg-slate-100 my-2 mx-6"></div>
                                                <button onClick={onLogout} className="block w-full text-left px-6 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors">
                                                    Ausloggen
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2">
                                            <Link href="/login" className="block px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                                                Einloggen
                                            </Link>
                                            <Link href="/signup" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                Registrieren
                                            </Link>
                                            <div className="h-px bg-slate-100 my-2 mx-6"></div>
                                            <Link href="/host" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                Gastgeber werden
                                            </Link>
                                            <Link href="/help" className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                                Hilfe-Center
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden">
                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 text-slate-900">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
