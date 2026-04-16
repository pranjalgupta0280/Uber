const axios = require('axios');

// Get Coordinates (Address -> Latitude/Longitude)
module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.LOCATIONIQ_API_KEY; 
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const location = response.data[0];
            
            // LOG THIS to be sure
            console.log("Raw LocationIQ Data:", location.lat, location.lon);

            return {
                ltd: location.lat, // We call it ltd to match your controller
                lng: location.lon  // LocationIQ uses 'lon', not 'lng'
            };
        }
        throw new Error('Address not found');
    } catch (error) {
        throw error;
    }
};

// Get Distance & Time (Coordinates -> Distance/Duration)
module.exports.getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const coords = `${origin.lng},${origin.ltd};${destination.lng},${destination.ltd}`;
    const url = `https://us1.locationiq.com/v1/matrix/driving/${coords}?key=${apiKey}&annotations=distance,duration`;

    try {
        const response = await axios.get(url);
        
        // LocationIQ uses 'code', Google used 'status'
        if (response.data && response.data.code === 'Ok') {
            return {
                // distances[0][1] is the distance from Point A to Point B
                distance: response.data.distances[0][1] / 1000, // Keep as raw number (KM)
                duration: response.data.durations[0][1] / 60    // Keep as raw number (Minutes)
            };
        } else {
            throw new Error(response.data.code || 'Unable to calculate distance');
        }
    } catch (error) {
        console.error("Distance API Error:", error.message);
        throw error; // 🚨 CRITICAL: You must re-throw the error here!
    }
};

module.exports.getDistanceTimeMatrix = async (origin, destinations) => {
    if (!origin || !Array.isArray(destinations) || destinations.length === 0) {
        throw new Error('Origin and destination list are required');
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const coords = [origin, ...destinations]
        .map((point) => `${point.lng},${point.ltd}`)
        .join(';');
    const url = `https://us1.locationiq.com/v1/matrix/driving/${coords}?key=${apiKey}&annotations=distance,duration`;

    try {
        const response = await axios.get(url);

        if (response.data && response.data.code === 'Ok') {
            return response.data;
        } else {
            throw new Error(response.data.code || 'Unable to calculate matrix distances');
        }
    } catch (error) {
        console.error('Matrix distance API error:', error.message);
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