import dotenv from 'dotenv';

dotenv.config();

export const env = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  host: process.env.HOST,
  db_url: process.env.DB_URL,
  jwtEpiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
