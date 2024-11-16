const Visit = require('../models/Visit');
const User = require('../models/User');

const visitController = {
  getVisitsByGymSection: async (req, res) => {
    try {
      const { gymSectionId } = req.params;
      
      console.log('Fetching visits for gym section:', gymSectionId);
      
      if (!gymSectionId) {
        return res.status(400).json({ message: 'Gym section ID is required' });
      }

      // Fetch visits with populated user data
      const visits = await Visit.find({ gymSectionId })
        .populate('userId', 'name email')
        .sort({ visitDateTime: -1 });
      
      console.log(`Found ${visits.length} visits`);
      
      res.json(visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      res.status(500).json({ 
        message: 'Error fetching visits',
        error: error.message 
      });
    }
  }
};

module.exports = visitController; 