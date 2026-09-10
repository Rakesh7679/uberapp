const captainModel = require('../models/captain.model');
const axios = require('axios');
let mapTilerUnavailable = false;
const geocodeCache = new Map();
const suggestionCache = new Map();

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPTILER_API_KEY;

    if (!apiKey) {
        console.warn('MapTiler API key not found, using mock data');
        return mockCoordinate(address);
    }

    try {
        const feature = await mapTilerGeocode(address, apiKey) || await nominatimGeocode(address);
        if (feature) {
            const [lng, lat] = feature.geometry.coordinates;
            return {
                ltd: lat,
                lng
            };
        }

        throw new Error('No results found');
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return nominatimGeocode(address).then(feature => {
            if (!feature) return mockCoordinate(address);
            const [lng, lat] = feature.geometry.coordinates;
            return { ltd: lat, lng };
        });
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.MAPTILER_API_KEY;

    if (!apiKey) {
        console.warn('MapTiler API key not found, using mock data');
        return mockDistanceTime(origin, destination);
    }

    try {
        const [originFeature, destinationFeature] = await Promise.all([
            mapTilerGeocode(origin, apiKey).then(feature => feature || nominatimGeocode(origin)).catch(() => nominatimGeocode(origin)),
            mapTilerGeocode(destination, apiKey).then(feature => feature || nominatimGeocode(destination)).catch(() => nominatimGeocode(destination))
        ]);
        if (!originFeature || !destinationFeature) throw new Error('No route found');

        const [originLng, originLat] = originFeature.geometry.coordinates;
        const [destinationLng, destinationLat] = destinationFeature.geometry.coordinates;
        const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destinationLng},${destinationLat}?overview=false`;
        const response = await axios.get(url);
        const route = response.data.routes?.[0];
        if (!route) throw new Error('No route found');

        return {
            distance: { text: `${(route.distance / 1000).toFixed(1)} km`, value: Math.round(route.distance) },
            duration: { text: `${Math.round(route.duration / 60)} mins`, value: Math.round(route.duration) }
        };
    } catch (error) {
        console.error('MapTiler routing error:', error.message);
        return mockDistanceTime(origin, destination);
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        return [];
    }

    const apiKey = process.env.MAPTILER_API_KEY;

    if (!apiKey) {
        console.warn('MapTiler API key not found, using OpenStreetMap suggestions');
        return nominatimSuggestions(input);
    }

    if (mapTilerUnavailable) {
        return nominatimSuggestions(input);
    }

    try {
        if (suggestionCache.has(input.toLowerCase())) {
            return suggestionCache.get(input.toLowerCase());
        }
        const response = await axios.get(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(input)}.json?autocomplete=true&limit=5&key=${apiKey}`
        );
        const suggestions = (response.data.features || []).map(feature => ({
            description: feature.place_name,
            place_id: feature.id
        }));
        const result = suggestions.length ? suggestions : await nominatimSuggestions(input);
        suggestionCache.set(input.toLowerCase(), result);
        return result;
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            mapTilerUnavailable = true;
        }
        console.error('Autocomplete error:', error.message);
        const result = await nominatimSuggestions(input);
        suggestionCache.set(input.toLowerCase(), result);
        return result;
    }
};

async function mapTilerGeocode(query, apiKey) {
    const cacheKey = query.toLowerCase();
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);
    if (mapTilerUnavailable) return null;

    try {
    const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?limit=1&key=${apiKey}`
    );
        const feature = response.data.features?.[0] || null;
        geocodeCache.set(cacheKey, feature);
        return feature;
    } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            mapTilerUnavailable = true;
        }
        return null;
    }
}

async function nominatimGeocode(query) {
    const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
        { headers: { 'User-Agent': 'EchoRide/1.0' } }
    );
    const location = response.data?.[0];
    if (!location) return null;
    return {
        geometry: { coordinates: [Number(location.lon), Number(location.lat)] },
        place_name: location.display_name
    };
}

async function nominatimSuggestions(input) {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(input)}`,
            { headers: { 'User-Agent': 'EchoRide/1.0' } }
        );
        return response.data.map(location => ({
            description: location.display_name,
            place_id: location.place_id
        }));
    } catch (error) {
        console.error('Location suggestion fallback error:', error.message);
        try {
            const response = await axios.get(
                `https://photon.komoot.io/api/?limit=5&q=${encodeURIComponent(input)}`
            );
            return response.data.features.map(feature => ({
                description: feature.properties.name
                    ? `${feature.properties.name}, ${feature.properties.city || feature.properties.country || ''}`
                    : feature.properties.country,
                place_id: feature.properties.osm_id
            }));
        } catch (fallbackError) {
            console.error('Location suggestion backup error:', fallbackError.message);
            return [];
        }
    }
}

// Mock functions as fallback
function mockCoordinate(address) {
    const mockLocations = {
        'new york': { ltd: 40.7128, lng: -74.0060 },
        'los angeles': { ltd: 34.0522, lng: -118.2437 },
        'chicago': { ltd: 41.8781, lng: -87.6298 },
        'houston': { ltd: 29.7604, lng: -95.3698 },
        'phoenix': { ltd: 33.4484, lng: -112.0740 }
    };

    const normalized = (address || '').toLowerCase().trim();
    if (mockLocations[normalized]) {
        return mockLocations[normalized];
    }

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
        hash |= 0;
    }

    return {
        ltd: 38.0 + (hash % 100) / 100,
        lng: -97.0 + (hash % 100) / 100
    };
}

function mockDistanceTime(origin, destination) {
    const distance = Math.random() * 20 + 2; // 2-22 km
    const duration = distance * 3; // ~3 mins per km

    return {
        distance: {
            text: `${distance.toFixed(1)} km`,
            value: Math.round(distance * 1000)
        },
        duration: {
            text: `${Math.round(duration)} mins`,
            value: Math.round(duration * 60)
        }
    };
}

function mockSuggestions(input) {
    return [
        { description: `${input} Main Street, City Center` },
        { description: `${input} Station, North District` },
        { description: `${input} Square, Downtown` },
        { description: `${input} Airport Terminal 1` },
        { description: `${input} Park, West Side` }
    ];
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // Find all captains who are currently connected or active
    const captains = await captainModel.find({
        socketId: { $ne: null }
    });

    return captains;
};
