// models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org', required: true },
    manufacturer: String,
    model: String,
    year: String,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
