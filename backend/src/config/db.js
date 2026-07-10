const mongoose = require('mongoose');

let isLocalDB = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('⚠️  No MONGODB_URI found. Initializing Local File-based Database fallback...');
    isLocalDB = true;
    return { isLocalDB: true };
  }

  try {
    // Fix for DNS SRV resolution issues on Windows/Node.js
    require('dns').setServers(['8.8.8.8', '8.8.4.4']);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Increased timeout for proper connection
    });
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    isLocalDB = false;
    return { isLocalDB: false };
  } catch (error) {
    console.warn(`⚠️  Failed to connect to MongoDB (${error.message}). Falling back to Local File-based Database...`);
    isLocalDB = true;
    return { isLocalDB: true };
  }
};

module.exports = {
  connectDB,
  getIsLocalDB: () => isLocalDB,
  setIsLocalDB: (val) => { isLocalDB = val; }
};
