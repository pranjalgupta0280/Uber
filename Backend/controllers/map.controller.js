const mapService=require("../services/maps.service")

const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getTripDetails = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;
    console.log("Request received for:", pickup, "to", destination);

    try {
        const pickupCoords = await mapService.getAddressCoordinate(pickup);
        const destinationCoords = await mapService.getAddressCoordinate(destination);

        const stats = await mapService.getDistanceTime(pickupCoords, destinationCoords);

        res.status(200).json({
            pickup: pickupCoords,
            destination: destinationCoords,
            distance: stats.distance, // Removing "+ km" here allows frontend to do math
            duration: stats.duration
        });
    } catch (error) {
        console.error("Trip Detail Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}