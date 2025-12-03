const { Client } = require("pg");

/**
 * Why the previous code was unsafe:
 *
 * 1. SQL Injection via always-true condition:
 *    If a user enters something like:
 *       name = "' OR 1=1 --"
 *    the query becomes:
 *       SELECT Population FROM Country WHERE Name = '' OR 1=1 -- ' AND code='...'
 *    Because `1=1` is always true, the database returns all rows.
 *
 * 2. SQL Injection enabling destructive commands:
 *    If input is not sanitized, an attacker could inject additional SQL, for example:
 *       name = "'; DROP TABLE Country; --"
 *    This can transform the query into one that executes harmful statements,
 *    potentially deleting or modifying data.
 *
 * Using parameterized queries ($1, $2, etc.) prevents these attacks by
 * ensuring user input is treated as data, never executable SQL.
 */

const conn = new Client({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpass",
  database: "world",
  port: 5432,
});

conn.connect();

function getPopulation(Country, name, code, cb) {
  const query = `
    SELECT population
    FROM ${Country}
    WHERE name = $1 AND code = $2
  `;

  conn.query(query, [name, code], function (err, result) {
    if (err) cb(err);
    else if (result.rows.length === 0) cb(new Error("Not found"));
    else cb(null, result.rows[0].population);
  });
}
