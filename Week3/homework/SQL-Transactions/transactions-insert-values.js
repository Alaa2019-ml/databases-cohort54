import client from "./client.js";

async function insertValues() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    await client.query("BEGIN");

    await client.query(`INSERT INTO account (account_number, balance) VALUES
    (101, 2000.00),
    (102, 500.00),
    (103, 300.00),
    (104, 50.00),
    (105, 0.00)`);

    await client.query(`INSERT INTO account_changes(account_number, amount, changed_date, remark) VALUES
    (101, 200.00, '2025-01-20T10:15:00Z', 'Deposit'),
    (102, -50.00, '2025-01-21T14:30:00Z', 'ATM Withdrawal'),
    (103, 1000.00, '2025-01-22T09:00:00Z', 'Salary Deposit'),
    (101, -100.00, '2025-01-23T11:45:00Z', 'Online Purchase'),
    (101, 200.00, '2025-01-24T10:15:00Z', 'ATM Withdrawal')
    `);

    await client.query("COMMIT");

    // if successful
    console.log("Tables inserted successfully");
  } catch (error) {
    console.error("Error inserting tables", error);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
}

insertValues();
