const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const mysqlPool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  maxIdle: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  multipleStatements: true,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports=mysqlPool;
