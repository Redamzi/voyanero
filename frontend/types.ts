export enum UserRole {
    GUEST = 'guest',
    HOST = 'host',
    ADMIN = 'admin'
}

export enum ListingType {
    LOCAL = 'local',
    AFFILIATE = 'affiliate'
}

export enum PropertyType {
    APARTMENT = 'Apartment',
    HOUSE = 'House',
    VILLA = 'Villa',
    HOTEL = 'Hotel',
    CABIN = 'Cabin'
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CHECKED_IN = 'checked-in',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    avatar?: string;
    stripeAccountId?: string;
    isOnboardingComplete?: boolean;
}

export interface Listing {
    id: string;
    title: string;
    description: string;
    type: ListingType;
    propertyType: PropertyType;
    price: number;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    images: string[];
    amenities: string[];
    rating: number;
    reviewCount: number;
    maxGuests: number;
    hostId?: string; // For local listings
    affiliateUrl?: string; // For affiliate listings
}

export interface Booking {
    id: string;
    listingId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    status: BookingStatus;
    createdAt: string;
}

export interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
}
