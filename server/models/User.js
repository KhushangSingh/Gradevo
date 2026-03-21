const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    securityQuestion: {
      type: String,
    },
    securityAnswer: {
      type: String,
    },
    cgpa: {
      type: Number,
      required: [true, 'Please add CGPA'],
    },
    degree: {
      type: String,
      required: [true, 'Please add degree'], // e.g., B.Tech, B.Sc
    },
    branch: {
      type: String,
      required: [true, 'Please add branch'], // e.g., CSE, ECE
    },
    specialization: {
      type: String,
      default: 'Core', // e.g., AIML, Cloud, Core
    },
    batch: {
      type: Number,
      required: [true, 'Please add batch year'], // e.g., 2024
    },
    college: {
      type: String,
      required: [true, 'Please add college name'],
    },
    anonymousName: {
      type: String,
    },
    friendCode: {
      type: String,
      unique: true,
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isDummy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
