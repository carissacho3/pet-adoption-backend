const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,  
    minlength: 3,  
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email'], 
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50, 
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50, 
  },
  profilePicture: {
    type: String, 
    default: 'https://example.com/default-profile-pic.jpg', 
  },
 
  role: {
    type: String,
    enum: ['user', 'admin'],  
    default: 'user', 
  },
    bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Pet'
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;