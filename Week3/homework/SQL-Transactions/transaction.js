import client from "./client.js";

async function runTransaction() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    await client.query("BEGIN");

    //withdraw 1000 from account 101
    await client.query(
      `UPDATE account SET balance = balance - 1000 WHERE account_number = 101`
    );

    //Deposit the money to 102
    await client.query(`
      UPDATE account SET balance = balance + 1000 WHERE account_number = 102
    `);

    //log them to account changes
    await client.query(`
  INSERT INTO account_changes (account_number, amount, changed_date, remark) 
  VALUES 
    (101, -1000.00, NOW(), 'Transfer 1000 to 102'),
    (102,  1000.00, NOW(), '1000 from 101')
`);

    await client.query("COMMIT");

    // if successful
    console.log("Transaction executed successfully");
  } catch (error) {
    console.error("Error executing transaction", error);
    await client.query("ROLLBACK");
  } finally {
    await client.end();
  }
}

runTransaction();
