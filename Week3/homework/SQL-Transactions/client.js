import { Client } from "pg";

const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpass",
  database: "postgres",
  port: 5432,
};

const client = new Client(config);
export default client;
