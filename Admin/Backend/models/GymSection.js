const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the working hours of the gym
const workingHoursSchema = new Schema({
  day: {
    type: String,
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  }
});

// Define the schema for the GymSection
const gymSectionSchema = new Schema({
  gymId: {
    type: Schema.Types.ObjectId,
    ref: 'GymAccount', // Reference to the GymAccount model
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String, // Array of image URLs
      required: true
    }
  ],
  workingHours: [workingHoursSchema], // Array of working hours for each day
  facebookUrl: {
    type: String,
    required: false
  },
  instagramUrl: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  city: {
    type: String,
    enum: ['Zarqa', 'Amman', 'Irbid', 'Aqaba', 'Ma\'an', 'Karak', 'Madaba', 'Ajloun', 'Jerash', 'Balqa', 'Tafilah'], // Limit to known cities
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON point
      required: true
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
      required: true
    }
  },
  isOpen: { // New field to indicate if the gym is open
    type: Boolean,
  },
  averageRating: { // New field for average rating
    type: Number,
    default: 0,
    min: 0,
    max: 10
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create a 2dsphere index on the location field for geospatial queries
gymSectionSchema.index({ location: '2dsphere' });

const GymSection = mongoose.model('GymSection', gymSectionSchema);

module.exports = GymSection;
