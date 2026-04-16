const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const { sendEventToSocketWithAck } = require('../socket');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('VALIDATION ERRORS:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination, vehicleType } = req.body;

    try {
        const closestCaptains = await rideService.getClosestCaptains(pickup, vehicleType);
        if (!closestCaptains.length) {
            return res.status(404).json({ message: 'No active captains available' });
        }

        // Create the ride document first, without assigning a captain initially
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });

        for (const { captain, distance, duration } of closestCaptains) {
            if (!captain.socketId) {
                console.log(`Captain ${captain._id} has no socketId, skipping.`);
                continue;
            }

            const ridePayload = {
                rideId: ride._id,
                fare: ride.fare,
                pickup: ride.pickup,
                destination: ride.destination,
                user: {
                    id: req.user._id,
                    name: `${req.user.fullname.firstname} ${req.user.fullname.lastname}`,
                    email: req.user.email
                },
                distance,
                duration,
                captainId: captain._id
            };

            try {
                console.log(`Attempting to send ride request to captain ${captain._id} (${captain.socketId})`);
                await sendEventToSocketWithAck(captain.socketId, 'newRideRequest', ridePayload);

                // Acknowledged! Assign the captain and notify the user
                ride.captain = captain._id;
                await ride.save();
                console.log(`Ride request acknowledged by and assigned to captain ${captain._id}`);

                return res.status(201).json({
                    message: 'Ride request sent and acknowledged.',
                    ride,
                    assignedCaptainId: captain._id
                });
            } catch (ackError) {
                console.warn(`Captain ${captain._id} did not acknowledge ride request: ${ackError.message}`);
            }
        }

        // If the loop finishes with no acknowledgment
        ride.status = 'cancelled';
        await ride.save();
        return res.status(404).json({ message: 'No available captains acknowledged the request.' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};      