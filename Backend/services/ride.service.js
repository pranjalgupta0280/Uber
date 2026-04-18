const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // 1. CONVERT NAMES TO COORDINATES (The missing step!)
    // These return objects like { ltd: 26.46, lng: 80.32 }
    const pickupCoords = await mapService.getAddressCoordinate(pickup);
    const destinationCoords = await mapService.getAddressCoordinate(destination);

    // 2. SEND THE COORDINATES (Not the names) TO GET DISTANCE
    const distanceTime = await mapService.getDistanceTime(pickupCoords, destinationCoords);

    // 3. DO THE MATH
    const baseFare = { auto: 30, car: 50, moto: 20 };
    const perKmRate = { auto: 10, car: 15, moto: 8 };
    const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

    const fare = {
        auto: Math.round(baseFare.auto + (distanceTime.distance * perKmRate.auto) + (distanceTime.duration * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceTime.distance * perKmRate.car) + (distanceTime.duration * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distanceTime.distance * perKmRate.moto) + (distanceTime.duration * perMinuteRate.moto))
    };

    return fare;
}

module.exports.getClosestCaptains = async (pickup, vehicleType) => {
    if (!pickup || !vehicleType) {
        throw new Error('Pickup and vehicleType are required');
    }

    const pickupCoords = await mapService.getAddressCoordinate(pickup);

    const captains = await captainModel.find({
        status: 'active',
        'vehicle.vehicleType': vehicleType,
        'location.coordinates.0': { $exists: true },
        'location.coordinates.1': { $exists: true },
        socketId: { $exists: true, $ne: null }
    }).lean();

    if (!captains.length) {
        throw new Error('No active captains available nearby');
    }

    const captainsWithLocation = captains.filter((captain) => {
        const coords = captain.location?.coordinates;
        return Array.isArray(coords)
            && coords.length >= 2
            && typeof coords[0] === 'number'
            && typeof coords[1] === 'number';
    });

    if (!captainsWithLocation.length) {
        throw new Error('No captains with valid location coordinates available');
    }

    const destinations = captainsWithLocation.map((captain) => ({
        lng: captain.location.coordinates[0],
        ltd: captain.location.coordinates[1]
    }));

    const matrix = await mapService.getDistanceTimeMatrix(pickupCoords, destinations);
    const distances = matrix.distances[0];
    const durations = matrix.durations[0];

    return captainsWithLocation.map((captain, index) => ({
        captain,
        distance: distances[index + 1] / 1000,
        duration: durations[index + 1] / 60
    })).sort((a, b) => a.distance - b.distance);
}

// Keeping your OTP logic
function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

module.exports.getFare = getFare; // Exported so controllers can show fares before booking

module.exports.createRide = async ({
    user, pickup, destination, vehicleType, captain
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('User, pickup, destination, and vehicleType are required');
    }
    console.log(pickup, destination)
    const fare = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        captain,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;
};