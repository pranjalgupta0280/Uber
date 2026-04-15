const express = require('express');
const router = express.Router();
const authMiddleware=require("../middleware/auth.middleware")
const mapController=require("../controllers/map.controller")
const { query } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser, 
    mapController.getCoordinates
);

// 2. NEW Route: Get Distance and Time
router.get('/get-distance',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getTripDetails // Make sure this matches your controller method name
);
router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);
module.exports = router;