import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const sequalize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { 
        max: 5, // Maximum number of open connections at the same time
        min: 0, // Minimum number of connections that are kept open
        acquire: 30000, // Maximum time (ms) Sequelize will try to get a connection before throwing an error
        idle: 10000, // Maximum time (ms) a connection can be idle before being released
    },
    timezone: "+00:00",
  }
);

export default sequalize;
