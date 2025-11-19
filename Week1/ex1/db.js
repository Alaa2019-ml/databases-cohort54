import { Pool } from "pg";

//make a reusable connection to meetup database.
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
});

export default pool;
