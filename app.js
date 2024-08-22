const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vehicleRoutes = require('./routes/vehicleRoutes');
const orgRoutes = require('./routes/orgRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/vehicles', vehicleRoutes); // Vehicle-related routes
app.use('/orgs', orgRoutes); // Organization-related routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
