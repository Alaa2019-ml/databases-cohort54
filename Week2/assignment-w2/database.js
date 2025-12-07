import { Client } from "pg";
//step1 : connect to postgres
const client = new Client({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "postgres",
  port: 5432,
});

export const dbName = "prep-ex2";

try {
  //Connect to postgres
  await client.connect();

  //check if the database already exists
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname =$1",
    [dbName]
  );

  //no database
  if (result.rowCount === 0) {
    //Create database
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log("Database created");
  }
} catch (error) {
  console.log("Database error ", error);
} finally {
  //disconnects from the database and releases all resources.
  await client.end(); //closes connection
}
