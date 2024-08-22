const axios = require('axios');
const Vehicle = require('../models/Vehicle');
const Org = require('../models/Org');

// Cache to store decoded VINs and limit API calls
let vinCache = {};
let apiCallCount = 0;
const rateLimit = process.env.NHTSA_API_RATE_LIMIT || 5;
let lastApiCallTime = Date.now();

// Decode VIN
async function decodeVin(req, res) {
    const vin = req.params.vin;

    // Simple validation
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    // Check cache first
    if (vinCache[vin]) {
        return res.json(vinCache[vin]);
    }

    // Rate limiting logic
    const currentTime = Date.now();
    if (currentTime - lastApiCallTime > 60000) {
        apiCallCount = 0;
        lastApiCallTime = currentTime;
    }

    if (apiCallCount >= rateLimit) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    // Call NHTSA API
    try {
        const response = await axios.get(`${process.env.NHTSA_API_URL}vehicles/DecodeVin/${vin}?format=json`);
        const vehicleData = {
            manufacturer: response.data.Results[7].Value,
            model: response.data.Results[9].Value,
            year: response.data.Results[10].Value
        };

        // Cache the result
        vinCache[vin] = vehicleData;
        apiCallCount++;

        res.json(vehicleData);
    } catch (error) {
        res.status(500).json({ error: 'Error decoding VIN' });
    }
}

// Add a new vehicle
async function addVehicle(req, res) {
    const { vin, org } = req.body;

    // Validate VIN and Org
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    const organization = await Org.findById(org);
    if (!organization) {
        return res.status(400).json({ error: 'Invalid organization ID' });
    }

    // Decode VIN
    try {
        const vehicleData = vinCache[vin] || await decodeVin({ params: { vin } }, res);
        if (!vehicleData || !vehicleData.manufacturer) {
            return;  // If decodeVin sends a response, stop execution here
        }

        // Create and save vehicle
        const vehicle = new Vehicle({
            vin,
            org,
            manufacturer: vehicleData.manufacturer,
            model: vehicleData.model,
            year: vehicleData.year
        });

        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error saving vehicle' });
    }
}

// Get vehicle by VIN
async function getVehicleByVin(req, res) {
    const vin = req.params.vin;

    // Simple validation
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    try {
        const vehicle = await Vehicle.findOne({ vin });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching vehicle' });
    }
}

module.exports = {
    decodeVin,
    addVehicle,
    getVehicleByVin
};
