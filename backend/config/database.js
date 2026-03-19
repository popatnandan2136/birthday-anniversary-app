const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB');
      return;
    }

    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    throw error; // Let the caller handle it or Vercel log it
  }
};

module.exports = connectDB;
