const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.join(__dirname, `../../.env.${env}`),
});

const required = ["DB_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const config = {
  env,
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || "localhost",
  appName: process.env.APP_NAME || "mern-backend",
  apiVersion: process.env.API_VERSION || "v1",
  clientUrl: process.env.CLIENT_URL || "http:// :3000",

  db: {
    db_url: process.env.DB_URL,
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE, 10) || 10,
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 50,
  },

  bcryptSaltRounds:process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};

module.exports = Object.freeze(config);
