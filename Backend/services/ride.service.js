const rideModel = require('../models/ride.model');
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

// Keeping your OTP logic
function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

module.exports.getFare = getFare; // Exported so controllers can show fares before booking

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }
    console.log(pickup,destination)
    const fare = await getFare(pickup, destination);

    // CRITICAL: Added 'await' here so the ride actually saves before returning
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;
};