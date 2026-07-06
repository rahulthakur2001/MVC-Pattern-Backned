const config = require("./env");
const mongoose = require("mongoose");
const logger = require("./logger");

const url = config.db.db_url;
const min = config.db.minPoolSize;
const max = config.db.maxPoolSize;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectWithRetry(retriesLeft = MAX_RETRIES) {
  try {
    await mongoose.connect(url, {
      minPoolSize: min,
      maxPoolSize: max,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(
      `MongoDB connection failed: ${error.message} Retries left: ${retriesLeft}`,
    );
    if(retriesLeft === 0){
      logger.error("MongoDB connection exhausted retries. Exiting.");
          process.exit(1);
    }

    await new Promise((resolve)=>{
      setTimeout(resolve, RETRY_DELAY_MS);
      return connectWithRetry(retriesLeft - 1);
    });
  }
  return mongoose.connection;
}


mongoose.connection.on('disconnected',()=>{
  logger.warn('MongoDB disconnescted !');
});

mongoose.connection.on('reconnected',()=>{
  logger.info('MongoDB reconnected');
});

mongoose.connection.on('error',(err)=>{
  logger.error(`MongoDB error: $ {error.message}`)
});

async function disconnectDB() {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed gracefully");
}


module.exports = { connectDB: connectWithRetry, disconnectDB, mongoose };