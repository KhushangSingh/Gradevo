const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generate } = require('random-words');
const connectDB = require('../config/db');
const User = require('../models/User');
const ArchivedUser = require('../models/ArchivedUser');
const AcademicMapping = require('../models/AcademicMapping');

dotenv.config({ path: './.env' });

const collegeName = 'Vellore Institute of Technology Bhopal';

// Helper to get random number in range
const getRandomCount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ACADEMIC_PROGRAMS = [
  // B.Tech
  { degree: 'B.Tech', branch: 'Aerospace Engineering', spec: 'Core', range: [21, 39] },
  { degree: 'B.Tech', branch: 'Bioengineering', spec: 'Core', range: [21, 39] },
  
  // CSE B.Tech
  { degree: 'B.Tech', branch: 'CSE', spec: 'Core', count: 82 },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (AI & ML)', count: 82 },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (Cyber Security & Digital Forensics)', range: [30, 40] },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (Cloud Computing & Automation)', range: [30, 40] },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (E-Commerce Technology)', range: [30, 40] },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (Education Technology)', range: [30, 40] },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (Gaming Technology)', range: [30, 40] },
  { degree: 'B.Tech', branch: 'CSE', spec: 'Specialization in (Health Informatics)', range: [30, 40] },

  // ECE B.Tech
  { degree: 'B.Tech', branch: 'ECE', spec: 'Core', range: [21, 39] },
  { degree: 'B.Tech', branch: 'ECE', spec: 'Specialization in (AI & Cybernetics)', range: [21, 39] },

  // Mechanical B.Tech
  { degree: 'B.Tech', branch: 'Mechanical', spec: 'Core', range: [21, 39] },
  { degree: 'B.Tech', branch: 'Mechanical', spec: 'Specialization in (AI & Robotics)', range: [21, 39] },

  // BBA
  { degree: 'BBA', branch: 'Bachelor of Business Administration', spec: 'Core', range: [21, 39] },

  // M.Tech
  { degree: 'M.Tech', branch: 'AI', spec: 'Core', range: [21, 39] },
  { degree: 'M.Tech', branch: 'CSE', spec: 'Specialization in (Cyber Security)', range: [21, 39] },
  { degree: 'M.Tech', branch: 'CSE', spec: 'Specialization in (Computational and Data Science)', range: [21, 39] },
  { degree: 'M.Tech.', branch: 'AI and Bioinformatics', spec: 'Core', range: [21, 39] },
  { degree: 'M.Tech', branch: 'Computer Science & Engineering', spec: 'Specialization in (Cyber Security & Digital Forensics)', range: [21, 39] },
  { degree: 'M.Tech', branch: 'Artificial Intelligence & Data Science', spec: 'Core', range: [21, 39] },
  { degree: 'M.Tech', branch: 'VLSI Design', spec: 'Core', range: [21, 39] },

  // Post Grad
  { degree: 'MBA', branch: 'Master of Business Administration', spec: 'Core', range: [21, 39] },
  { degree: 'MCA', branch: 'Master of Computer Applications', spec: 'Core', range: [21, 39] }
];

const generateDummyUsers = async () => {
  const dummyUsers = [];
  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash('password123', salt);

  for (const prog of ACADEMIC_PROGRAMS) {
    const count = prog.count || getRandomCount(prog.range[0], prog.range[1]);
    
    for (let i = 0; i < count; i++) {
      const nameParts = generate({ exactly: 2 });
      const name = nameParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const email = `${nameParts.join('.')}.${uuidv4().substring(0, 4)}@vitbhopal.ac.in`.toLowerCase();
      
      // Generate CGPA with 2 decimal places (cap at 9.5)
      // We add a tiny unique offset based on index to ensure they are varied
      const randomBase = Math.random() * (9.5 - 7) + 7;
      const uniqueOffset = (i * 0.01) % 0.1;
      const cgpa = parseFloat((randomBase + uniqueOffset).toFixed(2));
      
      const anonymousName = generate({ exactly: 2, join: ' ' });
      const friendCode = uuidv4().substring(0, 8).toUpperCase();

      dummyUsers.push({
        name,
        email,
        password: commonPassword,
        cgpa,
        degree: prog.degree,
        branch: prog.branch,
        specialization: prog.spec,
        batch: 2023,
        college: collegeName,
        anonymousName,
        friendCode,
        friends: [],
        isDummy: true,
      });
    }
  }
  return dummyUsers;
};

const importData = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing dummy data...');
    await User.deleteMany({ isDummy: true });
    await ArchivedUser.deleteMany({ isDummy: true });
    await AcademicMapping.deleteMany({}); // Pure VIT Bhopal mapping

    console.log('Generating and seeding initial academic mappings...');
    const initialMappings = ACADEMIC_PROGRAMS.map(p => ({
      degree: p.degree,
      branch: p.branch,
      specialization: p.spec
    }));
    await AcademicMapping.insertMany(initialMappings);

    console.log('Generating new dummy users...');
    const users = await generateDummyUsers();
    
    console.log(`Importing ${users.length} users...`);
    const chunkSize = 100;
    for (let i = 0; i < users.length; i += chunkSize) {
      const chunk = users.slice(i, i + chunkSize);
      await User.insertMany(chunk);
      console.log(`Inserted ${i + chunk.length}/${users.length} users`);
    }

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('Destroying only dummy data...');
    await User.deleteMany({ isDummy: true });
    await ArchivedUser.deleteMany({ isDummy: true });
    await AcademicMapping.deleteMany({}); 

    console.log('Dummy Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

// cd server then run below commands -
// Import Data: npm run data:import
// Delete Data: npm run data:destroy

//git commit -m "dummy data and finde me button"   