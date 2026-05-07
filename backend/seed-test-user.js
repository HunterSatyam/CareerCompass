import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

async function seedTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('   Email: test@example.com');
      console.log('   Password: Test@1234');
      console.log('   Role: applicant');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('Test@1234', 10);

      // Create test user
      const testUser = await User.create({
        fullname: 'Test User',
        email: 'test@example.com',
        phoneNumber: '9876543210',
        password: hashedPassword,
        role: 'applicant',
        isVerified: true,
        profile: {
          profilePhoto: '',
          resume: '',
          resumeOriginalName: ''
        }
      });

      console.log('✅ Test user created successfully!');
      console.log('   Email: test@example.com');
      console.log('   Password: Test@1234');
      console.log('   Role: applicant');
    }

    // Create a recruiter test user
    const recruiterEmail = 'recruiter@example.com';
    const existingRecruiter = await User.findOne({ email: recruiterEmail });
    if (existingRecruiter) {
      console.log('✅ Test recruiter already exists');
      console.log('   Email: recruiter@example.com');
      console.log('   Password: Recruiter@1234');
      console.log('   Role: recruiter');
    } else {
      const hashedPassword = await bcrypt.hash('Recruiter@1234', 10);
      await User.create({
        fullname: 'Test Recruiter',
        email: recruiterEmail,
        phoneNumber: '9876543211',
        password: hashedPassword,
        role: 'recruiter',
        isVerified: true,
        profile: {
          profilePhoto: '',
          resume: '',
          resumeOriginalName: ''
        }
      });

      console.log('✅ Test recruiter created successfully!');
      console.log('   Email: recruiter@example.com');
      console.log('   Password: Recruiter@1234');
      console.log('   Role: recruiter');
    }

    // List all users
    const allUsers = await User.find({}, { email: 1, fullname: 1, role: 1, isVerified: 1 });
    console.log('\n📋 All users in database:');
    console.table(allUsers);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedTestUser();
