export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction, 
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/v1/auth', 
};

