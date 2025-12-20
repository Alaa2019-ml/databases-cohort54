import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri);

export async function transfer(from, to, amount, remark) {
  const session = client.startSession();
  const db = client.db("databaseWeek4");
  const accounts = db.collection("accounts");

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    await client.connect();

    const results = await session.withTransaction(async () => {
      // get last change_number
      const latest = await accounts
        .aggregate(
          [
            { $unwind: "$account_changes" },
            {
              $group: {
                _id: null,
                maxChange: { $max: "$account_changes.change_number" },
              },
            },
          ],
          { session }
        )
        .toArray();

      let next = (latest[0]?.maxChange ?? 0) + 1;

      const senderResult = await accounts.updateOne(
        { account_number: from },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: next,
              amount: -amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      next++;

      const recipientResult = await accounts.updateOne(
        { account_number: to },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: next,
              amount,
              changed_date: new Date(),
              remark,
            },
          },
        },
        { session }
      );

      return { senderResult, recipientResult };
    }, transactionOptions);

    console.log("Transaction complete:", results);
  } catch (error) {
    console.error("Transaction aborted:", error);
    await session.abortTransaction();
  } finally {
    await session.endSession();
    await client.close();
  }
}
