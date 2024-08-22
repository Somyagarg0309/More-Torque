const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Route to decode VIN and get vehicle details
router.get('/decode/:vin', vehicleController.decodeVin);

// Route to add a new vehicle
router.post('/', vehicleController.addVehicle);

// Route to fetch a vehicle by VIN
router.get('/:vin', vehicleController.getVehicleByVin);

module.exports = router;
