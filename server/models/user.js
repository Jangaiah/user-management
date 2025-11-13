import mongoose from 'mongoose';

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  secret: { 
    type: String 
  }, // for TOTP MFA
  isVerified: { 
    type: Boolean,
    default: false 
  },
  isMfaEnabled: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'seller', 'manager', 'employee'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const User = mongoose.model('User', userSchema);

// Export the model
export default User;
