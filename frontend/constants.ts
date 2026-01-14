import { Listing, ListingType, PropertyType, User, UserRole } from './types';

export const APP_NAME = "VOYANERO";

export const AMENITIES = [
    "WiFi", "Kitchen", "Free Parking", "Pool", "Air Conditioning",
    "Washer", "Dryer", "TV", "Iron", "Heating"
];

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        email: 'guest@example.com',
        name: 'John Doe',
        role: UserRole.GUEST,
        avatar: 'https://picsum.photos/seed/u1/200/200'
    },
    {
        id: 'u2',
        email: 'host@example.com',
        name: 'Sarah Host',
        role: UserRole.HOST,
        avatar: 'https://picsum.photos/seed/u2/200/200',
        stripeAccountId: 'acct_123456789',
        isOnboardingComplete: true
    }
];

export const MOCK_LISTINGS: Listing[] = [
    {
        id: 'l1',
        title: 'Luxury Beachfront Villa',
        description: 'Beautiful villa with private pool and sea view. Perfect for family vacations and group retreats.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.VILLA,
        price: 350,
        location: { address: 'Bali, Indonesia', lat: -8.4095, lng: 115.1889 },
        images: ['https://picsum.photos/seed/v1/800/600', 'https://picsum.photos/seed/v1-2/800/600'],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Free Parking', 'Air Conditioning'],
        rating: 4.9,
        reviewCount: 42,
        maxGuests: 8,
        hostId: 'u2'
    },
    {
        id: 'l2',
        title: 'Modern Loft in Berlin Mitte',
        description: 'Stylish apartment in the heart of Berlin. Close to all major attractions and nightlife.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.APARTMENT,
        price: 120,
        location: { address: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
        images: ['https://picsum.photos/seed/a1/800/600'],
        amenities: ['WiFi', 'Kitchen', 'TV', 'Heating'],
        rating: 4.7,
        reviewCount: 128,
        maxGuests: 2,
        hostId: 'u2'
    },
    {
        id: 'l3',
        title: 'Grand Hotel Majestic',
        description: 'A luxurious historical hotel with world-class service and amenities.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 450,
        location: { address: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
        images: ['https://picsum.photos/seed/h1/800/600'],
        amenities: ['WiFi', 'Pool', 'TV', 'Air Conditioning'],
        rating: 4.5,
        reviewCount: 2500,
        maxGuests: 4,
        affiliateUrl: 'https://booking.com/example'
    },
    {
        id: 'l4',
        title: 'Cozy Mountain Cabin',
        description: 'Escape the city in this rustic cabin. Perfect for hiking and nature lovers.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.CABIN,
        price: 85,
        location: { address: 'Chamonix, France', lat: 45.9237, lng: 6.8694 },
        images: ['https://picsum.photos/seed/c1/800/600'],
        amenities: ['WiFi', 'Kitchen', 'Heating', 'Free Parking'],
        rating: 4.8,
        reviewCount: 64,
        maxGuests: 4,
        hostId: 'u2'
    },
    {
        id: 'l5',
        title: 'Hilton Paris Opera',
        description: 'Chic hotel with refined dining, an elegant bar & fitness center.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 320,
        location: { address: 'Paris, France', lat: 48.8566, lng: 2.3522 },
        images: ['https://picsum.photos/seed/h2/800/600'],
        amenities: ['WiFi', 'Air Conditioning', 'TV'],
        rating: 4.4,
        reviewCount: 1800,
        affiliateUrl: 'https://booking.com/example2',
        maxGuests: 2
    }
];
