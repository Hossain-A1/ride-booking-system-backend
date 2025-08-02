import dotenv from "dotenv";

dotenv.config();

export interface IEnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  ADMIN_EMAIL:string
  ADMIN_PASSWORD:string
  ADMIN_PHONE:string
  EXPRESS_SESSION_SECRET:string
  BCRYPT_SALT_ROUND: string;
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvValues: string[] = [
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'ADMIN_PHONE',
    "BCRYPT_SALT_ROUND",
    'EXPRESS_SESSION_SECRET','DB_URL'
  ];

  requiredEnvValues.forEach((keyname) => {
    if (!process.env[keyname])
      throw new Error(`Missing require env name ${keyname}`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    ADMIN_PHONE: process.env.ADMIN_PHONE as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
  };
};

export const ENV = loadEnvVariables();
