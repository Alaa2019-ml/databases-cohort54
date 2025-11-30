import { Client } from "pg";

// Database connection configuration
const config = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
  port: 5432,
};

const client = new Client(config);

async function selectQuery(selectQuery) {
  return await client.query(selectQuery);
}

function logResults(queryResults) {
  queryResults.rows.forEach((row) => {
    console.log(`${row.name}`);
  });
}

async function query1() {
  // 1. What are the names of countries with population greater than 8 million?
  console.log(
    "The names of countries with population greater than 8 million: "
  );
  const results = await selectQuery(
    "SELECT Name FROM country WHERE Population > 8000000"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query2() {
  // 2. What are the names of countries that have "land" in their names?
  console.log("The names of countries that have 'land' in their names: ");
  const results = await selectQuery(
    "SELECT Name FROM country WHERE Name ILIKE '%land%'"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query3() {
  // 3. What are the names of the cities with population in between 500,000 and 1 million?
  console.log(
    "The names of the cities with population in between 500,000 and 1 million: "
  );
  const results = await selectQuery(
    "SELECT Name FROM city WHERE Population between 500000 AND 1000000"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query4() {
  // 4. What's the name of all the countries on the continent 'Europe'?
  console.log("The name of all the countries on the continent 'Europe': ");
  const results = await selectQuery(
    "SELECT Name FROM country WHERE Continent LIKE 'Europe%'"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query5() {
  // 5. List all the countries in the descending order of their surface areas.
  console.log(
    "List of all the countries in the descending order of their surface areas: "
  );
  const results = await selectQuery(
    "SELECT Name FROM country ORDER BY SurfaceArea DESC"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query6() {
  //   6. What are the names of all the cities in the Netherlands?
  console.log("List of all cities in the Netherlands: ");
  const results = await selectQuery(
    "SELECT Name FROM city WHERE CountryCode = 'NLD'"
  );
  logResults(results);

  console.log("\n....................................................\n");
}

async function query7() {
  // 7. What is the population of Rotterdam?
  console.log("The population of Rotterdam: ");
  const result = await client.query(
    "SELECT Population FROM city WHERE name like '%Rotterdam%'"
  );
  console.log(result.rows[0].population);

  console.log("\n....................................................\n");
}

async function query8() {
  //  8. What's the top 10 countries by Surface Area?
  console.log("Top 10 countries by Surface Area: ");
  const results = await selectQuery(
    "SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10"
  );
  logResults(results);

  console.log("\n....................................................\n");
}

async function query9() {
  //  9. What's the top 10 most populated cities?
  console.log("The 10 most populated cities: ");
  const results = await selectQuery(
    "SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10"
  );
  logResults(results);
  console.log("\n....................................................\n");
}

async function query10() {
  // 10. What is the population number of the world?

  console.log("The population number of the world: ");
  const result = await client.query("SELECT SUM(Population) FROM country");
  console.log(result.rows[0].sum);

  console.log("\n....................................................\n");
}

async function queries() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL (world database)!");
    console.log("\n....................................................\n");

    // 1. What are the names of countries with population greater than 8 million?
    await query1();

    // 2. What are the names of countries that have "land" in their names?
    await query2();

    // 3. What are the names of the cities with population in between 500,000 and 1 million?
    await query3();

    // 4. What's the name of all the countries on the continent 'Europe'?
    await query4();

    // 5. List all the countries in the descending order of their surface areas.
    await query5();

    //   6. What are the names of all the cities in the Netherlands?
    await query6();

    // 7. What is the population of Rotterdam?
    await query7();

    //  8. What's the top 10 countries by Surface Area?
    await query8();

    //  9. What's the top 10 most populated cities?
    await query9();

    // 10. What is the population number of the world?
    await query10();
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
  }
}

queries();
