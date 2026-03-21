const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ArchivedUser = require('../models/ArchivedUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generate: generateRandomWord } = require('random-words');
const { isCollegeEmail, resolveCollegeFromDomain } = require('../utils/collegeDomains');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name: rawName, email: rawEmail, password,
    cgpa, college: rawCollege, degree: rawDegree,
    branch: rawBranch, specialization: rawSpec, batch,
  } = req.body;

  const name = rawName?.trim();
  const email = rawEmail?.trim().toLowerCase();
  const college = rawCollege?.trim();
  const degree = rawDegree?.trim();
  const branch = rawBranch?.trim();
  const specialization = rawSpec?.trim();

  if (!name || !email || !password || cgpa === undefined || cgpa === null || cgpa === '' || !college || !degree || !branch || !batch) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const cgpaNum = Number(cgpa);
  if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
    res.status(400);
    throw new Error('CGPA must be a number between 0 and 10');
  }

  // Validate that the email is a college/institutional email (.edu / .ac.in)
  const collegeCheck = isCollegeEmail(email);
  if (!collegeCheck.isValid) {
    res.status(400);
    throw new Error('Please use a valid college email address ending in .edu or .ac.in');
  }

  // Use the college name explicitly chosen by the user
  const collegeName = college;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate random data
  const anonymousName = generateRandomWord({ exactly: 2, join: ' ' }); // e.g., "bubbly cat"
  const friendCode = uuidv4().substring(0, 8).toUpperCase();

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    cgpa: cgpaNum,
    degree,
    branch,
    specialization: specialization || 'Core',
    batch,
    college: collegeName,
    anonymousName,
    friendCode,
    friends: []
  });

  if (user) {
    // Secondary safety: check if the email domain resolves to a *different* known
    // college than what the user selected. Only warn — never block registration.
    let collegeWarning = null;
    const domainCheck = resolveCollegeFromDomain(email.split('@')[1]?.toLowerCase());
    if (
      domainCheck?.collegeName &&
      domainCheck.collegeName.toLowerCase() !== collegeName.toLowerCase()
    ) {
      collegeWarning = `Your email domain suggests "${domainCheck.collegeName}", but you selected "${collegeName}". Please verify.`;
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      friendCode: user.friendCode,
      collegeWarning,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      friendCode: user.friendCode,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (user) {
    // Return token to allow frontend to reset storage timer explicitly
    res.status(200).json({ 
      ...user._doc,
      token: generateToken(user._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out completely' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.college) user.college = req.body.college.trim();
    if (req.body.degree) user.degree = req.body.degree.trim();
    if (req.body.branch) user.branch = req.body.branch.trim();
    if (req.body.specialization) user.specialization = req.body.specialization.trim();
    if (req.body.batch) user.batch = req.body.batch;

    if (req.body.cgpa !== undefined && req.body.cgpa !== null && req.body.cgpa !== '') {
      const cgpaNum = Number(req.body.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        res.status(400);
        throw new Error('CGPA must be a number between 0 and 10');
      }
      user.cgpa = cgpaNum;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get leaderboard with anonymity logic
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
  const { degree, branch, specialization, batch, college } = req.query;
  const currentUserId = req.user.id;

  // Build filter object dynamically
  let filter = {};
  if (degree && degree !== 'undefined') filter.degree = degree;
  if (branch && branch !== 'undefined') filter.branch = branch;
  if (specialization && specialization !== 'undefined') filter.specialization = specialization;
  if (college && college !== 'undefined') filter.college = college;

  if (batch && batch !== 'undefined' && !isNaN(Number(batch))) {
    filter.batch = Number(batch);
  }

  // 1. Get ALL matching users sort by CGPA
  const users = await User.find(filter).sort({ cgpa: -1 });

  // 2. Get current user (to check friend list)
  const currentUser = await User.findById(currentUserId);
  const friendIds = currentUser.friends.map(id => id.toString());

  // 3. Map to safe response
  const leaderboard = users.map((user, index) => {
    const isMe = user._id.toString() === currentUserId;
    const isFriend = friendIds.includes(user._id.toString());
    const isVisible = isMe || isFriend;

    return {
      _id: user._id,
      rank: index + 1,
      name: isVisible ? user.name : user.anonymousName,
      cgpa: user.cgpa,
      degree: user.degree,
      branch: user.branch,
      college: user.college,
      specialization: user.specialization,
      isMe,
      isFriend: isFriend // helps frontend show "Friend" badge maybe
    };
  });

  res.json(leaderboard);
});

// @desc    Get populated friends list
// @route   GET /api/users/friends
// @access  Private
const getFriends = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).populate(
    'friends',
    'name cgpa college degree branch batch anonymousName'
  );

  if (!currentUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(currentUser.friends);
});

// @desc    Add friend by code
// @route   POST /api/users/add-friend
// @access  Private
const addFriend = asyncHandler(async (req, res) => {
  const { friendCode } = req.body;
  const currentUserId = req.user.id;

  if (!friendCode) {
    res.status(400);
    throw new Error('Please provide a friend code');
  }

  const friendToAdd = await User.findOne({ friendCode });

  if (!friendToAdd) {
    res.status(404);
    throw new Error('Invalid Friend Code');
  }

  if (friendToAdd._id.toString() === currentUserId) {
    res.status(400);
    throw new Error('You cannot add yourself as a friend');
  }

  const currentUser = await User.findById(currentUserId);

  if (currentUser.friends.includes(friendToAdd._id)) {
    res.status(400);
    throw new Error('User is already your friend');
  }

  currentUser.friends.push(friendToAdd._id);
  await currentUser.save();

  res.status(200).json({
    message: `Friend added! You can now see ${friendToAdd.name} on the leaderboard.`
  });
});

// @desc    Delete user account (archives data first, then removes from live DB)
// @route   DELETE /api/users/profile
// @access  Private
const deleteProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // 1. Save a full snapshot to the archive collection before any deletion
    await ArchivedUser.create({
      originalId: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      cgpa: user.cgpa,
      degree: user.degree,
      branch: user.branch,
      specialization: user.specialization,
      batch: user.batch,
      college: user.college,
      anonymousName: user.anonymousName,
      friendCode: user.friendCode,
      friends: user.friends,
      originalCreatedAt: user.createdAt,
      deletedAt: new Date(),
    });

    // 2. Remove the user from every other user's friends list
    await User.updateMany(
      { friends: req.user.id },
      { $pull: { friends: req.user.id } }
    );

    // 3. Delete the live record
    await User.deleteOne({ _id: req.user.id });

    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  deleteProfile,
  getLeaderboard,
  addFriend,
  getFriends,
};
