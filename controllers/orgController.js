const Org = require('../models/Org');

// Helper function to update child organizations
async function updateChildOrganizations(parentOrg, updateData) {
    // Find child organizations of the given parent organization
    const children = await Org.find({ parent: parentOrg._id });

    for (const child of children) {
        // Update child organizations with new policies from parent if applicable
        if (updateData.fuelReimbursementPolicy && !child.fuelReimbursementPolicy) {
            child.fuelReimbursementPolicy = updateData.fuelReimbursementPolicy;
        }
        if (updateData.speedLimitPolicy && !child.speedLimitPolicy) {
            // Only apply new speedLimitPolicy if it's not overridden by child
            child.speedLimitPolicy = updateData.speedLimitPolicy;
        }

        // Save the updated child organization
        await child.save();
        // Recursively update any children of this child organization
        await updateChildOrganizations(child, updateData);
    }
}

// Create a new organization
async function createOrg(req, res) {
    const { name, account, website, fuelReimbursementPolicy, speedLimitPolicy } = req.body;

    // Validate required fields
    if (!name || !account || !website || !speedLimitPolicy) {
        return res.status(400).json({ error: 'Name, account, website, and speedLimitPolicy are required' });
    }

    try {
        const newOrg = new Org({
            name,
            account,
            website,
            fuelReimbursementPolicy: fuelReimbursementPolicy || '1000', // Default value
            speedLimitPolicy
        });
        const savedOrg = await newOrg.save();
        res.status(201).json(savedOrg);
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ error: 'Error creating organization' });
    }
}

// Update an organization's details
async function updateOrg(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const org = await Org.findById(id);
        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Check if the organization has a parent
        const parentOrg = org.parent ? await Org.findById(org.parent) : null;

        // Validate and apply updates
        if (updateData.fuelReimbursementPolicy !== undefined) {
            // Ensure that only parent organizations can set this policy
            if (parentOrg && parentOrg.fuelReimbursementPolicy) {
                return res.status(400).json({ error: 'Cannot update fuelReimbursementPolicy on child organizations' });
            }
            org.fuelReimbursementPolicy = updateData.fuelReimbursementPolicy;
        }

        if (updateData.speedLimitPolicy !== undefined) {
            // Only update if speedLimitPolicy is not already overridden by child
            if (parentOrg && org.speedLimitPolicy !== parentOrg.speedLimitPolicy) {
                return res.status(400).json({ error: 'Cannot update speedLimitPolicy on organizations with existing overridden policy' });
            }
            org.speedLimitPolicy = updateData.speedLimitPolicy;
        }

        // Update other fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined && key !== 'fuelReimbursementPolicy' && key !== 'speedLimitPolicy') {
                org[key] = updateData[key];
            }
        });

        // Save updated organization
        const updatedOrg = await org.save();

        // Update all child organizations with new policies if applicable
        if (parentOrg) {
            await updateChildOrganizations(updatedOrg, updateData);
        }

        res.status(200).json(updatedOrg);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: 'Error updating organization' });
    }
}

// Get all organizations
async function getAllOrgs(req, res) {
    try {
        const orgs = await Org.find();
        res.status(200).json(orgs);
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ error: 'Error fetching organizations' });
    }
}

module.exports = {
    createOrg,
    updateOrg,
    getAllOrgs
};
