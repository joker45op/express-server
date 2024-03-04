const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql");
const xlsx = require("xlsx");
const fs = require("fs");
const axios = require("axios");
const { makePdf } = require("./test.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: "*" }));

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

// Create a MySQL connection
// const connection = mysql.createConnection({
//   host: "localhost", // Your database host
//   user: "root", // Your database username
//   password: "1234",
//   database: "icard",
// });

const connection = mysql.createConnection({
  host: "sql6.freesqldatabase.com	", // Your database host
  user: "sql6688712", // Your database username
  password: "Wj4kqfcyrF",
  database: "sql6688712",
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error);
  } else {
    const sql = "show tables";

    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        // res.status(500).json({ error: "Database error" });
      } else {
        console.log(results);
        // res.json(results);
      }
    });
    console.log("Connected to MySQL");
  }
});

app.get("/", (req, res) => {
  // makePdf(pic, name, fname, rnum, dob, mnum, addr);

  const sql = "SELECT * FROM student_master";

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/:id", (req, res) => {
  // makePdf(pic, name, fname, rnum, dob, mnum, addr);
  const itemId = req.params.id;
  const sql =
    "SELECT * FROM student_master where ID_SECTION=" + itemId + " LIMIT 1";

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const fileBuffer = req.file.buffer;
  // Example: Save the file to disk (you can implement your logic here)
  fs.writeFile("./file.xlsx", fileBuffer, (error) => {
    // if (error) {
    //   return res.status(500).json({ message: "Error saving the file." });
    // }

    axios
      .get("http://localhost:3000/importToDb")
      .then((response) => {
        // Handle the response from the second endpoint
        // ...
        res
          .status(200)
          .json({ message: "Request to second endpoint completed" });
      })
      .catch((error) => {
        console.error("Error making request to second endpoint:", error);
      });
  });
});

app.get("/importToDb", (req, res) => {
  const workbook = xlsx.readFile("file.xlsx");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  console.log("saved");
  const query =
    "INSERT INTO student_master (ID,ID_CO_ID,ID_SELECT,ID_SESSION,ID_NAME,ID_F_NAME,ID_CLASS,ID_SECTION,ID_ROLLNO,ID_ADDRESS,ID_CONTACTNO,ID_BLOOD_G,ID_DOB,ID_IMAGE_NAME,ID_VALIDITY,ID_SHEET_NAME) VALUES ?";
  const values = data.map((entry) => [
    entry.ID,
    entry.ID_CO_ID,
    entry.ID_SELECT,
    entry.ID_SESSION,
    entry.ID_NAME,
    entry.ID_F_NAME,
    entry.ID_CLASS,
    entry.ID_SECTION,
    entry.ID_ROLLNO,
    entry.ID_ADDRESS,
    entry.ID_CONTACTNO,
    entry.ID_BLOOD_G,
    entry.ID_DOB,
    entry.ID_IMAGE_NAME,
    entry.ID_VALIDITY,
    entry.ID_SHEET_NAME,
  ]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", results);
      res.status(200).send();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
