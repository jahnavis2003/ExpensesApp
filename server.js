import { config } from 'dotenv';
// import express from 'express';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
config({ path: envFile });

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.DB_URL);
    // Start the server 
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

  } catch (error) {
    console.error(error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
