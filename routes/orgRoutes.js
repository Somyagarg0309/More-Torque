const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');

// Route to create a new organization
router.post('/', orgController.createOrg);

// Route to update an organization's details
router.patch('/:id', orgController.updateOrg);

// Route to fetch all organizations
router.get('/', orgController.getAllOrgs);

module.exports = router;
