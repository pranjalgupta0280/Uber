const axios = require('axios');

// Get Coordinates (Address -> Latitude/Longitude)
module.exports.getAddressCoordinate = async (address) => {
    // You can get a free token at LocationIQ.com
    const apiKey = process.env.LOCATIONIQ_API_KEY; 
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            return {
                ltd: parseFloat(location.lat), // Keep 'ltd' to match your previous code
                lng: parseFloat(location.lon)
            };
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        throw error;
    }
};

// Get Distance & Time (Coordinates -> Distance/Duration)
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY;
    // Format: lon,lat;lon,lat
    const coords = `${origin.lng},${origin.ltd};${destination.lng},${destination.ltd}`;
    const url = `https://us1.locationiq.com/v1/matrix/driving/${coords}?key=${apiKey}&annotations=distance,duration`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.code === 'Ok') {
            // Distance is in meters, duration is in seconds
            const distance = response.data.distances[0][1]; 
            const duration = response.data.durations[0][1];

            return {
                distance: (distance / 1000).toFixed(2), // Convert to Kilometers
                duration: Math.round(duration / 60)      // Convert to Minutes
            };
        } else {
            throw new Error('Unable to calculate distance');
        }
    } catch (error) {
        console.error("Distance API Error:", error.message);
        throw error;
    }
};
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY;
    // LocationIQ Autocomplete endpoint
    const url = `https://us1.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(input)}&format=json`;

    try {
        const response = await axios.get(url);
        
        // LocationIQ returns an array of results directly
        if (Array.isArray(response.data)) {
            // We map display_name to match your previous Google 'description' format
            return response.data.map(suggestion => suggestion.display_name).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error("Autocomplete Error:", err.message);
        throw err;
    }
};