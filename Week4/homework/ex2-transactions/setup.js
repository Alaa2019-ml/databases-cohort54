import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URL;

export async function setup() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("databaseWeek4");
    await insertAccountsCollection(db);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await client.close();
  }
}

async function insertAccountsCollection(db) {
  const accounts = db.collection("accounts");

  // clean up
  await accounts.drop().catch(() => {});

  await accounts.insertMany([
    {
      account_number: 101,
      balance: 2000,
      account_changes: [
        {
          change_number: 1,
          amount: 200,
          changed_date: new Date("2025-01-20T10:15:00Z"),
          remark: "Deposit",
        },
        {
          change_number: 2,
          amount: -100,
          changed_date: new Date("2025-01-23T11:45:00Z"),
          remark: "Online Purchase",
        },
      ],
    },
    {
      account_number: 102,
      balance: 500,
      account_changes: [
        {
          change_number: 3,
          amount: -50,
          changed_date: new Date("2025-01-21T14:30:00Z"),
          remark: "ATM Withdrawal",
        },
      ],
    },
    {
      account_number: 103,
      balance: 300,
      account_changes: [
        {
          change_number: 4,
          amount: 1000,
          changed_date: new Date("2025-01-22T09:00:00Z"),
          remark: "Salary Deposit",
        },
      ],
    },
    { account_number: 104, balance: 50, account_changes: [] },
    { account_number: 105, balance: 0, account_changes: [] },
  ]);

  console.log("Inserted into accounts collection");
}
