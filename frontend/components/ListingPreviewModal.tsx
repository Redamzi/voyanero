"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Listing, ListingType } from '../types';

interface ListingPreviewModalProps {
    listing: Listing;
    onClose: () => void;
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring" as const, damping: 25, stiffness: 300 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 }
    }
};

const ListingPreviewModal: React.FC<ListingPreviewModalProps> = ({ listing, onClose }) => {
    // Determine target URL
    const url = listing.type === ListingType.AFFILIATE && listing.affiliateUrl
        ? listing.affiliateUrl
        : `/listing/${listing.id}`;

    const isAffiliate = listing.type === ListingType.AFFILIATE;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
            />

            <motion.div
                className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-white shadow-sm transition-all"
                >
                    <i className="fa-solid fa-xmark text-lg"></i>
                </button>

                {/* Left: Image Gallery (Simple Carousel) */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 relative group">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-6 left-6">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                {listing.propertyType}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col text-left overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2 text-amber-500">
                        <i className="fa-solid fa-star text-sm"></i>
                        <span className="font-bold text-slate-900">{listing.rating}</span>
                        <span className="text-slate-400 text-sm">({listing.reviewCount} Bewertungen)</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                        {listing.title}
                    </h2>
                    <p className="text-slate-500 font-medium mb-6 text-lg">
                        {listing.location.address}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {listing.amenities.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                {amenity}
                            </span>
                        ))}
                        {listing.amenities.length > 4 && (
                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                +{listing.amenities.length - 4} mehr
                            </span>
                        )}
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-auto line-clamp-4">
                        {listing.description}
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Preis</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">€{listing.price}</span>
                                <span className="text-slate-500 font-medium text-sm">/ Nacht</span>
                            </div>
                        </div>

                        <Link
                            href={url}
                            target={isAffiliate ? "_blank" : "_self"}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:shadow-lg hover:scale-105 active:scale-95 transition-all shadow-orange-500/20"
                        >
                            {isAffiliate ? 'Zum Angebot' : 'Details ansehen'}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ListingPreviewModal;
