const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const authMiddleware = require('../middleware/authMiddleware');

// Get visits for a specific gym section
router.get('/gym-sections/:gymSectionId/visits', authMiddleware, visitController.getVisitsByGymSection);

module.exports = router; 