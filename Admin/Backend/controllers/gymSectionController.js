const GymSection = require('../models/GymSection');
const jwt = require('jsonwebtoken');

const gymSectionController = {
  // Create a new gym section
  createGymSection: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Validate image URLs
      let processedData = { ...req.body };
      if (processedData.images && Array.isArray(processedData.images)) {
        // Validate that each image is a valid URL
        processedData.images = processedData.images.filter(url => {
          try {
            new URL(url);
            return true;
          } catch (e) {
            console.warn('Invalid URL filtered out:', url);
            return false;
          }
        });
      }

      const gymSection = new GymSection({
        ...processedData,
        gymId: decoded.id
      });

      await gymSection.save();
      res.status(201).json(gymSection);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.error('Error creating gym section:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Get gym sections for the current gym account
  getMyGymSections: async (req, res) => {
    try {
      const gymSections = await GymSection.find({ gymId: req.user.id });
      res.json(gymSections);
    } catch (error) {
      console.error('Error fetching gym sections:', error);
      res.status(500).json({ message: 'Error fetching gym sections' });
    }
  },

  // Update a gym section
  updateGymSection: async (req, res) => {
    try {
      const gymSection = await GymSection.findOne({
        _id: req.params.id,
        gymId: req.user.id
      });

      if (!gymSection) {
        return res.status(404).json({ message: 'Gym section not found or unauthorized' });
      }

      // Validate image URLs
      let updateData = { ...req.body };
      if (updateData.images && Array.isArray(updateData.images)) {
        // Validate that each image is a valid URL
        updateData.images = updateData.images.filter(url => {
          try {
            new URL(url);
            return true;
          } catch (e) {
            console.warn('Invalid URL filtered out:', url);
            return false;
          }
        });
      }

      const updatedSection = await GymSection.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedSection);
    } catch (error) {
      console.error('Error updating gym section:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a gym section
  deleteGymSection: async (req, res) => {
    try {
      const gymSection = await GymSection.findOne({
        _id: req.params.id,
        gymId: req.user.id
      });

      if (!gymSection) {
        return res.status(404).json({ message: 'Gym section not found or unauthorized' });
      }

      await GymSection.findByIdAndDelete(req.params.id);
      res.json({ message: 'Gym section deleted successfully' });
    } catch (error) {
      console.error('Error deleting gym section:', error);
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = gymSectionController; 