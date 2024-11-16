const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6
  },
  isActive: { 
    type: Boolean, 
    default: true
  },
  profileImage: { 
    type: String
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  contactNumber: { 
    type: String 
  },
  googleId: { 
    type: String
  },
  businessDetails: {
    paymentInfo: {
      bankName: { type: String },
      accountNumber: { type: String },
      routingNumber: { type: String },
      paypalId: { type: String }
    },
  },
  // New fields for subscription
  currentSubscription: {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    remainingVisits: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date
    },
    expiresAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;
