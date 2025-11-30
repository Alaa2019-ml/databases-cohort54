import { Client } from "pg";

//step1 : connect to postgres
const client = new Client({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "postgres",
  port: 5432,
});

const dbName = "meetup";

try {
  //Connect to postgres
  await client.connect();
  console.log("Connected to PostgreSQL");

  //check if the database already exists
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname =$1",
    [dbName]
  );

  //if database exists
  if (result.rowCount !== 0) {
    // terminate existing connections
    await client.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1`,
      [dbName]
    );

    //drop database
    await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log("Existing database dropped");
  }

  // create database
  await client.query(`CREATE DATABASE "${dbName}"`);
  console.log("Database created");
} catch (error) {
  console.log("Database error ", error);
} finally {
  //disconnects from the database and releases all resources.
  await client.end(); //closes connection
}
