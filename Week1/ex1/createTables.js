import pool from "./db.js";

//3. Create a table called `Invitee` with the following fields (`invitee_no`, `invitee_name` and `invited_by`)
async function seedDatabase() {
  const CREATE_INVITEE_TABLE = `
    CREATE TABLE IF NOT EXISTS Invitee (
     invitee_no INTEGER PRIMARY KEY,
      invitee_name VARCHAR(50),
      invited_by INTEGER
    )`;

  // 4. Create a table called `Room` with the following fields (`room_no`, `room_name` and `floor_number`)
  const CREATE_ROOM_TABLE = `
    CREATE TABLE IF NOT EXISTS Room (
      room_no INTEGER PRIMARY KEY,
      room_name VARCHAR(100),
      floor_number INTEGER
    )`;

  // 5. Create a table called `Meeting` with the following fields (`meeting_no, meeting_title, starting_time, ending_time`
  //    ,`room_no`)
  const CREATE_MEETING_TABLE = `
    CREATE TABLE IF NOT EXISTS Meeting (
      meeting_no INTEGER PRIMARY KEY,
      meeting_title VARCHAR(150),
      starting_time DATE, 
      ending_time DATE, 
      room_no INTEGER,
       FOREIGN KEY (room_no) REFERENCES Room(room_no)
    )`;

  const invitees = [
    {
      inviteeNumber: 1001,
      inviteeName: "Ali",
      invitedBy: null,
    },

    {
      inviteeNumber: 1002,
      inviteeName: "Amer",
      invitedBy: 1001,
    },
    {
      inviteeNumber: 1003,
      inviteeName: "Layan",
      invitedBy: 1002,
    },
    {
      inviteeNumber: 1004,
      inviteeName: "Sarah",
      invitedBy: 1001,
    },
    {
      inviteeNumber: 1005,
      inviteeName: "Samar",
      invitedBy: 1002,
    },
  ];

  try {
    //create tables
    await pool.query(CREATE_INVITEE_TABLE);
    console.log("Invitee table created successfully");

    await pool.query(CREATE_ROOM_TABLE);
    console.log("Room table created successfully");

    await pool.query(CREATE_MEETING_TABLE);
    console.log("Meeting table created successfully");

    //insert into table Invitee
    for (const invitee of invitees) {
      const insertQuery = `
        INSERT INTO Invitee (invitee_no, invitee_name, invited_by)
        VALUES ($1, $2, $3)
        ON CONFLICT (invitee_no) DO NOTHING
      `;

      const values = [
        invitee.inviteeNumber,
        invitee.inviteeName,
        invitee.invitedBy,
      ];

      await pool.query(insertQuery, values);
      console.log(`Inserted invitee: ${invitee.inviteeName}`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
