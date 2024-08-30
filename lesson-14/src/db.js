import mongoose from 'mongoose';

async function initDBConnection() {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log('Database connection successfully');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { initDBConnection };
