// models/Org.js
const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    account: String,
    website: String,
    fuelReimbursementPolicy: { type: String, default: '1000' },
    speedLimitPolicy: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
});

module.exports = mongoose.model('Org', orgSchema);
