import client from "./client.js";

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    await client.query("BEGIN");

    await client.query("DROP TABLE IF EXISTS account_changes");

    await client.query("DROP TABLE IF EXISTS account");

    await client.query(`CREATE TABLE account (
	account_number INTEGER NOT NULL PRIMARY KEY,
	balance NUMERIC(12,2)
        )`);

    await client.query(`CREATE TABLE account_changes (
	change_number SERIAL PRIMARY KEY,
	account_number INTEGER, 
	amount NUMERIC(12,2),
	changed_date TIMESTAMP,
	remark VARCHAR(250),
	FOREIGN KEY (account_number) REFERENCES account(account_number)
)`);

    await client.query("COMMIT");

    // if successful
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    await client.query("ROLLBACK");
    console.log("Transaction failed");
  } finally {
    await client.end();
  }
}

seedDatabase();
