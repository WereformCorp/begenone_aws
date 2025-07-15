const { dbConnect } = require('lib_user_db-begenone');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, './config.env') });

// console.log(`process.env.ACCESS_KEY: `, process.env.AWS_ACCESS_KEY_ID); // This should now print the correct key
// console.log(
//   `process.env.AWS_SECRET_ACCESS_KEY: `,
//   process.env.AWS_SECRET_ACCESS_KEY
// );

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

// Environment Variables
const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_CLUSTER,
  DATABASE,
  DATABASE_OPTIONS,
} = process.env;

// Validate and connect
try {
  const DB_URI = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}/${DATABASE}?${DATABASE_OPTIONS}`;
  dbConnect(
    DB_URI,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_CLUSTER,
    DATABASE,
    DATABASE_OPTIONS
  );
} catch (error) {
  console.error('❌ Error initializing database:', error.message);
  process.exit(1);
}

// Microservice runs on PORT 5000
const PORT = process.env.PORT || 5000;
const app = require('./app');
app.listen(PORT, () => console.log(`🚀 DB Service running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});
