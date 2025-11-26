import { Client } from "pg";
import { authors, researches, researchAuthors } from "./data.js";

const config = {
  host: "localhost",
  port: 5432,
  user: "hyfuser",
  password: "hyfpassword",
  database: "prep-ex2",
};

const client = new Client(config);

async function seedDatabase() {
  const CREATE_AUTHORS_TABLE = `
    CREATE TABLE IF NOT EXISTS authors (
      author_id SERIAL PRIMARY KEY,
      author_name VARCHAR(100),
      university VARCHAR(100),
      date_of_birth DATE, 
      h_index INTEGER,
      gender VARCHAR(1) CHECK (gender IN ('m', 'f')),
      mentor INTEGER
    );
  `;

  const ADD_MENTOR_COLUMN = `
  ALTER TABLE authors
  ADD COLUMN mentor INTEGER;

  ALTER TABLE authors
  ADD CONSTRAINT fk_mentor
  FOREIGN KEY (mentor) REFERENCES authors(author_id);
`;

  const CREATE_RESEARCH_PAPERS = `
    CREATE TABLE IF NOT EXISTS research_papers (
      paper_id SERIAL PRIMARY KEY,
      paper_title VARCHAR(300),
      conference VARCHAR(300),
      publish_date DATE,
      published BOOLEAN DEFAULT false
    );
  `;

  const CREATE_RESEARCH_AUTHORS = `
    CREATE TABLE IF NOT EXISTS research_authors (
      author_id INTEGER,
      paper_id INTEGER,
      PRIMARY KEY (author_id, paper_id),
      FOREIGN KEY (author_id) REFERENCES authors(author_id),
      FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id)
    );
  `;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    await client.query(
      "TRUNCATE TABLE research_authors RESTART IDENTITY CASCADE"
    );
    await client.query(
      "TRUNCATE TABLE research_papers RESTART IDENTITY CASCADE"
    );
    await client.query("TRUNCATE TABLE authors RESTART IDENTITY CASCADE");

    await client.query(CREATE_AUTHORS_TABLE);
    console.log("Authors table created successfully");

    await client.query(ADD_MENTOR_COLUMN);
    console.log("Mentor column added to authors table");
    console.log("Authors table altered successfully");

    await client.query(CREATE_RESEARCH_PAPERS);
    console.log("Research Papers table created successfully");

    await client.query(CREATE_RESEARCH_AUTHORS);
    console.log("Research Authors table created successfully");

    for (const author of authors) {
      const insertQuery = `
        INSERT INTO authors(author_name, university, date_of_birth, h_index, gender, mentor)
        VALUES ($1, $2, $3, $4, $5, NULL)
      `;
      const values = [
        author.author_name,
        author.university,
        author.date_of_birth,
        author.h_index,
        author.gender,
      ];
      await client.query(insertQuery, values);
      console.log(`Inserted author: ${author.author_name}`);
    }

    for (const author of authors) {
      if (author.mentor !== null) {
        const updateQuery = `
          UPDATE authors
          SET mentor = $1
          WHERE author_name = $2
        `;
        await client.query(updateQuery, [author.mentor, author.author_name]);
        console.log(`Updated mentor for: ${author.author_name}`);
      }
    }

    for (const research of researches) {
      const insertQuery = `
        INSERT INTO research_papers(paper_title, conference, publish_date, published)
        VALUES ($1, $2, $3, $4)
      `;
      const values = [
        research.paper_title,
        research.conference,
        research.publish_date,
        research.published,
      ];
      await client.query(insertQuery, values);
      console.log(`Inserted research paper: ${research.paper_title}`);
    }

    for (const ele of researchAuthors) {
      const insertQuery = `
        INSERT INTO research_authors(author_id, paper_id)
        VALUES ($1, $2)
      `;
      const values = [ele.author_id, ele.paper_id];
      await client.query(insertQuery, values);
      console.log(`Inserted research author successfully.`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase();
