const  config  = require("../config/env");

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth",
};

module.exports = {
  REFRESH_COOKIE_OPTIONS,
};
