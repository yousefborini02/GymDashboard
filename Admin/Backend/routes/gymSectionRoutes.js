const express = require('express');
const router = express.Router();
const gymSectionController = require('../controllers/gymSectionController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new gym section
router.post('/gym-sections', authMiddleware, gymSectionController.createGymSection);

// Get gym sections for the current gym account
router.get('/gym-sections/my-sections', authMiddleware, gymSectionController.getMyGymSections);

// Update a gym section
router.put('/gym-sections/:id', authMiddleware, gymSectionController.updateGymSection);

// Delete a gym section
router.delete('/gym-sections/:id', authMiddleware, gymSectionController.deleteGymSection);

module.exports = router; 