"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Listing, ListingType } from '../types';

interface ListingCardProps {
    listing: Listing;
    onPreview?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPreview }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            setCurrentImageIndex(Math.round(scrollLeft / offsetWidth));
        }
    };

    // Helper to determine badge
    const getBadge = () => {
        if (listing.rating >= 4.9) return { text: "Gäste-Favorit", color: "bg-gradient-to-r from-amber-500 to-orange-600 text-white" };
        if (listing.price < 150) return { text: "Superpreis", color: "bg-emerald-500 text-white" };
        return null;
    };

    const badge = getBadge();

    const url = listing.type === ListingType.AFFILIATE && listing.affiliateUrl ? listing.affiliateUrl : `/listing/${listing.id}`;
    const target = listing.type === ListingType.AFFILIATE ? "_blank" : "_self";
    const rel = listing.type === ListingType.AFFILIATE ? "noopener noreferrer" : "";

    const handleCardClick = (e: React.MouseEvent) => {
        if (onPreview) {
            e.preventDefault();
            onPreview(listing);
        }
    };

    // Use a Div if preview is enabled, otherwise Link
    const Wrapper = onPreview ? 'div' : Link;
    const wrapperProps = onPreview ? { onClick: handleCardClick, className: "flex flex-col gap-1" } : { href: url, target, rel, className: "flex flex-col gap-1" };

    return (
        <div className="group flex flex-col h-full cursor-pointer relative" onClick={onPreview ? handleCardClick : undefined}>
            {/* Image Carousel */}
            <div className="relative aspect-[20/19] rounded-[1.5rem] overflow-hidden bg-slate-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar"
                >
                    {listing.images.map((img, idx) => {
                        const ImageContent = (
                            <img
                                src={img.replace('http:', 'https:')}
                                className="w-full h-full object-cover"
                                alt={listing.title}
                                draggable={false}
                            />
                        );

                        return onPreview ? (
                            <div key={idx} className="w-full h-full flex-shrink-0 snap-start block">
                                {ImageContent}
                            </div>
                        ) : (
                            <Link
                                key={idx}
                                href={url}
                                target={target}
                                rel={rel}
                                className="w-full h-full flex-shrink-0 snap-start block"
                            >
                                {ImageContent}
                            </Link>
                        );
                    })}
                </div>

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 pointer-events-none z-10">
                    {badge && (
                        <div className={`px-3 py-1.5 rounded-full shadow-sm ${badge.color} backdrop-blur-md bg-opacity-95`}>
                            <span className="text-[11px] font-black uppercase tracking-wider">{badge.text}</span>
                        </div>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    className="absolute top-3 right-3 p-2 text-white/70 hover:text-white hover:scale-110 transition-all active:scale-90 z-20"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add favorite logic here
                    }}
                >
                    <i className="fa-solid fa-heart text-2xl drop-shadow-lg"></i>
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none z-10">
                    {listing.images.slice(0, 5).map((_, idx) => ( // Limit dots to 5
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60'}`} />
                    ))}
                </div>

                {/* Gradient Overlay for Text Readability if needed */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />
            </div>

            {/* Content */}
            {/* @ts-expect-error - dynamic component props issue */}
            <Wrapper {...wrapperProps}>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-[16px] text-slate-900 truncate leading-snug tracking-tight flex-1">
                        {listing.location.address}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <i className="fa-solid fa-star text-[11px] text-slate-900"></i>
                        <span className="font-medium text-slate-900 text-[14px]">{listing.rating}</span>
                    </div>
                </div>

                <p className="text-slate-500 text-[15px] font-medium truncate">
                    {listing.type === ListingType.AFFILIATE ? `Flug mit ${listing.title.replace('Flug mit ', '')}` : `Hosted by ${listing.title}`}
                </p>

                <p className="text-slate-500 text-[15px] font-medium">
                    {listing.description.includes('Ab') ? listing.description : 'Flexible Termine'}
                </p>

                <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="font-bold text-[16px] text-slate-900">€{listing.price}</span>
                    <span className="text-slate-500 font-normal text-[15px]">
                        {listing.type === ListingType.AFFILIATE ? 'pro Person' : 'Nacht'}
                    </span>
                </div>
            </Wrapper>
        </div>
    );
};

export default ListingCard;
