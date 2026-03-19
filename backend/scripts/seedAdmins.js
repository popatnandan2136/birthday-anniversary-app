/**
 * Seed script to create admin users in MongoDB
 * Usage: node api/scripts/seedAdmins.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Admin users to seed
const adminsToCreate = [
  {
    name: 'Admin User',
    email: 'npadmin@gmail.com',
    password: 'npadmin@$@2136',
    role: 'ADMIN',
    isEmailVerified: true,
    status: 'active',
    isAdmin: true,
  },
  {
    name: 'Master Admin User',
    email: 'npmasteradmin@gmail.com',
    password: 'npmasteradmin@$@2136',
    role: 'MASTER_ADMIN',
    isEmailVerified: true,
    status: 'active',
    isAdmin: true,
  },
];

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB\n');

    // Create or update admin users
    for (const adminData of adminsToCreate) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: adminData.email });

        if (existingUser) {
          console.log(`⚠ User ${adminData.email} already exists. Updating...`);
          // Update the user
          await User.findByIdAndUpdate(
            existingUser._id,
            {
              role: adminData.role,
              isEmailVerified: adminData.isEmailVerified,
              status: adminData.status,
              isAdmin: adminData.isAdmin,
            },
            { new: true }
          );
          console.log(`✓ Updated ${adminData.email} (${adminData.role})\n`);
        } else {
          // Create new user
          const newUser = new User(adminData);
          await newUser.save();
          console.log(
            `✓ Created ${adminData.email} (${adminData.role}) successfully!\n`
          );
        }
      } catch (error) {
        if (error.code === 11000) {
          console.error(`✗ Email ${adminData.email} already exists in database`);
        } else {
          console.error(`✗ Error with ${adminData.email}:`, error.message);
        }
      }
    }

    // Display all admin users
    console.log('\n--- Current Admin Users ---');
    const allAdmins = await User.find({
      role: { $in: ['ADMIN', 'MASTER_ADMIN'] },
    }).select('name email role status');

    allAdmins.forEach((admin) => {
      console.log(`📧 ${admin.email} (${admin.role}) - Status: ${admin.status}`);
    });

    console.log('\n✓ Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error during seed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seed script
seedAdmins();
