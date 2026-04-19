// lib/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
