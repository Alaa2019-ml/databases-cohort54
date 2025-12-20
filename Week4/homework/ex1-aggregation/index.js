const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("databaseWeek4").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const mongoClient = client
      .db("databaseWeek4")
      .collection("population_pyramid_1950-2022");

    console.log(await getPopulationPerCountry(mongoClient, "Netherlands"));

    console.log(await getContinentInfo(mongoClient, 1990, "100+"));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const getPopulationPerCountry = async (mongoClient, country) => {
  const pipeline = [
    {
      $match: {
        Country: country,
      },
    },
    {
      $group: {
        _id: "$Year",
        countPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        Year: "$_id",
        countPopulation: 1,
      },
    },
    {
      $sort: {
        Year: 1,
      },
    },
  ]; //end pipeline

  return await mongoClient.aggregate(pipeline).toArray();
};

const getContinentInfo = async (mongoClient, year, age) => {
  const pipeline = [
    {
      $match: {
        Country: {
          $in: [
            "AFRICA",
            "ASIA",
            "EUROPE",
            "LATIN AMERICA AND THE CARIBBEAN",
            "NORTHERN AMERICA",
            "OCEANIA",
          ],
        },
        Year: year,
        Age: age,
      },
    },
    {
      $addFields: {
        TotalPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
  ]; //end pipeline

  return await mongoClient.aggregate(pipeline).toArray();
};
