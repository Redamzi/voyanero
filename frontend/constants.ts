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
    // --- TRENDING / LUXURY ---
    {
        id: 'l1',
        title: 'Luxury Beachfront Villa',
        description: 'Exclusive villa with infinity pool and direct ocean access.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.VILLA,
        price: 850,
        location: { address: 'Uluwatu, Bali', lat: -8.84, lng: 115.12 },
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop'],
        amenities: ['Pool', 'WiFi', 'Chef', 'Cinema'],
        rating: 4.95,
        reviewCount: 120,
        maxGuests: 8,
        hostId: 'u2'
    },
    {
        id: 'l3',
        title: 'Grand Hotel Majestic',
        description: 'Historical luxury in the heart of Rome.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 450,
        location: { address: 'Rome, Italy', lat: 41.90, lng: 12.49 },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'],
        amenities: ['Spa', 'Concierge', 'Fine Dining'],
        rating: 4.8,
        reviewCount: 2500,
        maxGuests: 4,
        affiliateUrl: 'https://booking.com/example'
    },
    {
        id: 'hx1',
        title: 'Santorini Sunset Suite',
        description: 'Breathtaking caldera views from your private jacuzzi.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.HOTEL,
        price: 620,
        location: { address: 'Oia, Greece', lat: 36.46, lng: 25.37 },
        images: ['https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop'],
        amenities: ['Jacuzzi', 'Breakfast', 'View'],
        rating: 4.98,
        reviewCount: 310,
        maxGuests: 2,
        hostId: 'u2'
    },
    {
        id: 'hx2',
        title: 'Swiss Alps Chalet',
        description: 'Ski-in/ski-out luxury chalet with sauna.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.CABIN,
        price: 1200,
        location: { address: 'Zermatt, Switzerland', lat: 46.02, lng: 7.74 },
        images: ['https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&auto=format&fit=crop'],
        amenities: ['Sauna', 'Fireplace', 'Ski Room'],
        rating: 5.0,
        reviewCount: 45,
        maxGuests: 10,
        hostId: 'u2'
    },

    // --- BEACH / TROPICAL ---
    {
        id: 'l_b1',
        title: 'Maldives Overwater Bungalow',
        description: 'Sleep above the crystal clear lagoon.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 950,
        location: { address: 'Malé, Maldives', lat: 4.17, lng: 73.50 },
        images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop'],
        amenities: ['Ocean Access', 'Room Service'],
        rating: 4.9,
        reviewCount: 850,
        maxGuests: 2,
        affiliateUrl: 'https://booking.com/maldives'
    },
    {
        id: 'l_b2',
        title: 'Tulum Jungle Eco-Lodge',
        description: 'Sustainable luxury amidst the Mayan jungle, steps from the beach.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.VILLA,
        price: 280,
        location: { address: 'Tulum, Mexico', lat: 20.21, lng: -87.46 },
        images: ['https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800&auto=format&fit=crop'],
        amenities: ['Yoga Deck', 'Bikes', 'Organic Breakfast'],
        rating: 4.7,
        reviewCount: 95,
        maxGuests: 4,
        hostId: 'u2'
    },
    {
        id: 'l_b3',
        title: 'Phuket Beach Resort',
        description: 'Family friendly resort with massive pool complex.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 150,
        location: { address: 'Phuket, Thailand', lat: 7.88, lng: 98.39 },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop'],
        amenities: ['Pool', 'Kids Club', 'Gym'],
        rating: 4.3,
        reviewCount: 200,
        maxGuests: 4,
        affiliateUrl: 'https://agoda.com/phuket'
    },
    {
        id: 'l_b4',
        title: 'Maui Oceanfront Condo',
        description: 'Wake up to the sound of waves in this modern condo.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.APARTMENT,
        price: 400,
        location: { address: 'Maui, Hawaii', lat: 20.79, lng: -156.33 },
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'],
        amenities: ['Balcony', 'Kitchen', 'Pool'],
        rating: 4.85,
        reviewCount: 150,
        maxGuests: 4,
        hostId: 'u2'
    },

    // --- CITY / URBAN ---
    {
        id: 'l2',
        title: 'Modern Loft in Berlin Mitte',
        description: 'Stylish apartment near Alexanderplatz.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.APARTMENT,
        price: 120,
        location: { address: 'Berlin, Germany', lat: 52.52, lng: 13.40 },
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'],
        amenities: ['WiFi', 'Workspace', 'Elevator'],
        rating: 4.7,
        reviewCount: 128,
        maxGuests: 2,
        hostId: 'u2'
    },
    {
        id: 'l5',
        title: 'Hilton Paris Opera',
        description: 'Classic Parisian elegance near the opera house.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 320,
        location: { address: 'Paris, France', lat: 48.85, lng: 2.35 },
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'],
        amenities: ['Bar', 'Air Conditioning'],
        rating: 4.4,
        reviewCount: 1800,
        maxGuests: 2,
        affiliateUrl: 'https://booking.com/paris'
    },
    {
        id: 'l_c1',
        title: 'New York Penthouse',
        description: 'Skyline views from Manhattan.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.APARTMENT,
        price: 750,
        location: { address: 'New York, NY', lat: 40.71, lng: -74.00 },
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop'],
        amenities: ['Doorman', 'Gym', 'Rooftop'],
        rating: 4.9,
        reviewCount: 80,
        maxGuests: 4,
        hostId: 'u2'
    },
    {
        id: 'l_c2',
        title: 'Tokyo Capsule Hotel',
        description: 'Unique and efficient stay in Shinjuku.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 45,
        location: { address: 'Tokyo, Japan', lat: 35.68, lng: 139.76 },
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop'],
        amenities: ['WiFi', 'Shared Lounge'],
        rating: 4.2,
        reviewCount: 500,
        maxGuests: 1,
        affiliateUrl: 'https://agoda.com/tokyo'
    },

    // --- NATURE / CABINS ---
    {
        id: 'l4',
        title: 'Cozy Mountain Cabin',
        description: 'Rustic charm with modern comfort in the French Alps.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.CABIN,
        price: 85,
        location: { address: 'Chamonix, France', lat: 45.92, lng: 6.86 },
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'],
        amenities: ['Fireplace', 'Hiking Trails'],
        rating: 4.8,
        reviewCount: 64,
        maxGuests: 4,
        hostId: 'u2'
    },
    {
        id: 'l_n1',
        title: 'Iceland Glass Igloo',
        description: 'Watch the Northern Lights from your bed.',
        type: ListingType.AFFILIATE,
        propertyType: PropertyType.HOTEL,
        price: 550,
        location: { address: 'Reykjavik, Iceland', lat: 64.14, lng: -21.94 },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'],
        amenities: ['Heating', 'Breakfast'],
        rating: 4.95,
        reviewCount: 1000,
        maxGuests: 2,
        affiliateUrl: 'https://booking.com/iceland'
    },
    {
        id: 'l_n2',
        title: 'Canadian Lake House',
        description: 'Peaceful retreat on Lake Louise.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.CABIN,
        price: 320,
        location: { address: 'Banff, Canada', lat: 51.17, lng: -115.57 },
        images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop'],
        amenities: ['Canoe', 'Deck', 'BBQ'],
        rating: 4.9,
        reviewCount: 75,
        maxGuests: 6,
        hostId: 'u2'
    },
    {
        id: 'l_n3',
        title: 'Glamping in Patagonia',
        description: 'Luxury camping under the stars.',
        type: ListingType.LOCAL,
        propertyType: PropertyType.CABIN,
        price: 180,
        location: { address: 'Torres del Paine, Chile', lat: -50.94, lng: -73.40 },
        images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop'],
        amenities: ['Fire Pit', 'Guided Tours'],
        rating: 4.8,
        reviewCount: 40,
        maxGuests: 2,
        hostId: 'u2'
    }
];
