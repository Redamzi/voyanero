"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { MOCK_USERS, MOCK_LISTINGS } from '@/constants';

type TabId = 'overview' | 'trips' | 'favorites' | 'settings';

export default function Dashboard() {
    const user = MOCK_USERS[1]; // Default to user for demo
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    // Mock data for dashboard
    const upcomingTrips = MOCK_LISTINGS.slice(0, 2);
    const favoriteListings = MOCK_LISTINGS.slice(2, 5);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar / Navigation */}
                    <div className="lg:w-72 shrink-0 space-y-8">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden relative">
                                <Image
                                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">{user.name}</h2>
                                <p className="text-xs text-slate-500 font-medium capitalize">{user.role}</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
                                { id: 'trips', label: 'My Trips', icon: 'fa-suitcase' },
                                { id: 'favorites', label: 'Favorites', icon: 'fa-heart' },
                                { id: 'settings', label: 'Settings', icon: 'fa-gear' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as TabId)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300
                                    ${activeTab === item.id
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                            : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                                >
                                    <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="bg-gradient-to-br from-[#FF385C] to-[#E31C5F] p-6 rounded-[2rem] text-white shadow-xl shadow-rose-500/20">
                            <i className="fa-solid fa-crown text-3xl mb-4 opacity-80"></i>
                            <h3 className="font-bold text-lg mb-1">Voyanero Plus</h3>
                            <p className="text-xs text-white/80 mb-4 leading-relaxed">Upgrade to unlock exclusive deals and 24/7 concierge support.</p>
                            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-sm">
                                Upgrade Now
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="mb-10">
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 capitalize tracking-tight">{activeTab === 'overview' ? `Welcome back, ${user.name.split(' ')[0]}` : activeTab}</h1>
                            <p className="text-slate-500 font-medium mt-2">Manage your travels and account details.</p>
                        </div>

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-12">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Upcoming Trips', value: '2', icon: 'fa-plane-departure', color: 'bg-indigo-50 text-indigo-600' },
                                        { label: 'Saved Places', value: '14', icon: 'fa-heart', color: 'bg-rose-50 text-rose-600' },
                                        { label: 'Loyalty Points', value: '2,450', icon: 'fa-star', color: 'bg-amber-50 text-amber-500' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                                            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                                <i className={`fa-solid ${stat.icon}`}></i>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                                <p className="text-sm text-slate-500 font-bold opacity-60 uppercase tracking-wide">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Upcoming Trips Preview */}
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-slate-900">Upcoming Trips</h2>
                                        <button onClick={() => setActiveTab('trips')} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">View all</button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {upcomingTrips.map(listing => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TRIPS TAB */}
                        {activeTab === 'trips' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                                {upcomingTrips.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                                {upcomingTrips.map(listing => (
                                    <ListingCard key={`${listing.id}-duplicate`} listing={listing} />
                                ))}
                            </div>
                        )}

                        {/* FAVORITES TAB */}
                        {activeTab === 'favorites' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                                {favoriteListings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in duration-500">
                                <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Profile Settings</h3>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                                            <input type="text" defaultValue={user.name.split(' ')[0]} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                                            <input type="text" defaultValue={user.name.split(' ')[1]} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                        <input type="email" defaultValue={user.email} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
