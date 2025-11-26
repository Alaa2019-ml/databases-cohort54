import { Client } from "pg";

const config = {
  host: "localhost",
  port: 5432,
  user: "hyfuser",
  password: "hyfpassword",
  database: "prep-ex2",
};

const client = new Client(config);

const query1 = async () => {
  console.log("The names of all 'authors' and their corresponding 'mentors':");

  const result = await client.query(
    "SELECT a.author_name AS authorName, b.author_name AS mentorName FROM authors a LEFT JOIN authors b ON a.mentor = b.author_id"
  );

  console.table(result.rows);
};

const query2 = async () => {
  console.log("Authors and their published paper_title:");

  const result = await client.query(
    "SELECT a.*, rp.paper_title FROM authors a LEFT JOIN research_authors ra ON ra.author_id = a.author_id LEFT JOIN research_papers rp ON rp.paper_id = ra.paper_id AND rp.published = true"
  );

  console.table(result.rows);
};

const query3 = async () => {
  console.log(
    "All research papers and the number of authors that wrote that paper:"
  );

  const result = await client.query(
    "SELECT rp.paper_title, COUNT(ra.author_id) AS authors_number FROM research_papers rp LEFT JOIN research_authors ra ON ra.paper_id = rp.paper_id GROUP BY rp.paper_title"
  );

  console.table(result.rows);
};

const query4 = async () => {
  console.log("Sum of the research papers published by all female authors:");

  const result = await client.query(
    "SELECT COUNT(DISTINCT rp.paper_id) AS female_papers FROM research_papers rp INNER JOIN research_authors ra ON ra.paper_id = rp.paper_id INNER JOIN authors a ON a.author_id = ra.author_id WHERE a.gender = 'f'"
  );

  console.table(result.rows);
};

const query5 = async () => {
  console.log("Average of the h-index of all authors per university:");

  const result = await client.query(
    "SELECT university, AVG(h_index) AS avg_h_index FROM authors GROUP BY university"
  );

  console.table(result.rows);
};

const query6 = async () => {
  console.log("Sum of the research papers of the authors per university:");

  const result = await client.query(
    "SELECT a.university, COUNT(DISTINCT rp.paper_id) AS total_papers FROM research_papers rp LEFT JOIN research_authors ra ON ra.paper_id = rp.paper_id LEFT JOIN authors a ON a.author_id = ra.author_id GROUP BY a.university"
  );

  console.table(result.rows);
};

const query7 = async () => {
  console.log(
    "Minimum and maximum of the h-index of all authors per university:"
  );

  const result = await client.query(
    "SELECT university, MIN(h_index) AS min_h_index, MAX(h_index) AS max_h_index FROM authors GROUP BY university"
  );

  console.table(result.rows);
};

async function selectAll() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");
    await query1();
    await query2();
    await query3();
    await query4();
    await query5();
    await query6();
    await query7();
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
  }
}

selectAll();
