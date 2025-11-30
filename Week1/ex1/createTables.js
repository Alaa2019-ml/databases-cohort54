// import pool from "./db.js";
import { Client } from "pg";
import { invitees, rooms, meetings } from "./data.js";

// Database connection configuration
const config = {
  host: "localhost",
  port: 5432,
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
};

const client = new Client(config);

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to meetup database!");

    //3. Create a table called `Invitee` with the following fields (`invitee_no`, `invitee_name` and `invited_by`)
    const CREATE_INVITEE_TABLE = `
    CREATE TABLE IF NOT EXISTS Invitee (
     invitee_no SERIAL PRIMARY KEY,
      invitee_name VARCHAR(50),
      invited_by INTEGER
    )`;

    // 4. Create a table called `Room` with the following fields (`room_no`, `room_name` and `floor_number`)
    const CREATE_ROOM_TABLE = `
    CREATE TABLE IF NOT EXISTS Room (
      room_no SERIAL PRIMARY KEY,
      room_name VARCHAR(100),
      floor_number INTEGER
    )`;

    // 5. Create a table called `Meeting` with the following fields (`meeting_no, meeting_title, starting_time, ending_time`
    //    ,`room_no`)
    const CREATE_MEETING_TABLE = `
    CREATE TABLE IF NOT EXISTS Meeting (
      meeting_no SERIAL PRIMARY KEY,
      meeting_title VARCHAR(150),
      starting_time TIMESTAMP, 
      ending_time TIMESTAMP, 
      room_no INTEGER,
       FOREIGN KEY (room_no) REFERENCES Room(room_no)
    )`;

    //create tables
    await client.query(CREATE_INVITEE_TABLE);
    console.log("Invitee table created successfully");

    await client.query(CREATE_ROOM_TABLE);
    console.log("Room table created successfully");

    await client.query(CREATE_MEETING_TABLE);
    console.log("Meeting table created successfully");

    //insert table invitees
    await insertInvitees(client, invitees);

    //insert table rooms
    await insertRooms(client, rooms);

    //insert table Meeting
    await insertMeetings(client, meetings);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seedDatabase();

const insertInvitees = async (client, invitees) => {
  //insert into table Invitee
  for (const invitee of invitees) {
    const insertQuery = `
        INSERT INTO Invitee (invitee_name, invited_by)
        VALUES ($1, $2)
      `;

    const values = [invitee.inviteeName, invitee.invitedBy];

    await client.query(insertQuery, values);
    console.log(`Inserted invitee: ${invitee.inviteeName}`);
  }
  console.log(".........................");
};

const insertRooms = async (client, rooms) => {
  //insert into table Room
  for (const room of rooms) {
    const insertQuery = `
        INSERT INTO Room (room_name, floor_number)
        VALUES ($1, $2)
      `;

    const values = [room.roomName, room.floorNumber];

    await client.query(insertQuery, values);
    console.log(`Inserted room: ${room.roomName}`);
  }
  console.log(".........................");
};

const insertMeetings = async (client, meetings) => {
  //insert into table Meeting
  for (const meeting of meetings) {
    const insertQuery = `
        INSERT INTO Meeting (meeting_title,  starting_time, ending_time, room_no)
        VALUES ($1, $2, $3, $4)
      `;

    const values = [
      meeting.meetingTitle,
      meeting.startingTime,
      meeting.endingTime,
      meeting.room_no,
    ];

    await client.query(insertQuery, values);
    console.log(`Inserted meeting: ${meeting.meetingTitle}`);
  }
  console.log(".........................");
};
