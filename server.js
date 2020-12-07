const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const app = express();
const fs = require("fs");
const parse = require("csv");
const format = require("pg-format");
const port = process.env.PORT || 5000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());

var upload = multer();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


app.post("/patientsData", upload.single("patientFile"), async (req, res) => {
  try {
    let data = req.file.buffer.toString("utf8");
    let allRows = data.trim().split("\r\n");
    let insertedRows = 0;
    if (allRows.length > 0) {
      let sqlRows = [];
      for (let row of allRows) {
        let patientData = row.split(",");
        sqlRows.push(patientData);
      }
      if (sqlRows.length > 0) {
        let sqlQuery = format(
          "INSERT INTO PATIENTS (NAME, AGE, GENDER, CONTACT,CITY, STATE, COUNTRY) VALUES %L RETURNING PATIENT_ID",
          sqlRows
        );
        const client = await pool.connect();
        const result = await client.query(sqlQuery);
        insertedRows = result && result.rowCount && result.rowCount > 0 ? result.rowCount : 0;
      }
    }
    let status = insertedRows > 0 ? "1" : "0";
    let responseData = { status, insertedRows };
    res.send(responseData);
  } catch (error) {
      res.status(500).send({
        message: 'Failed to upload the file'
      });
  }
});


app.get("/patients", async (req, res) => {
  try {
    const client = await pool.connect();
    let sqlQuery;
    if(req.query.patient_id){
        sqlQuery = format("SELECT * FROM PATIENTS WHERE PATIENT_ID = %s", req.query.patient_id);
    }
    else{
        sqlQuery = "SELECT * FROM PATIENTS";
    }
    const result = await client.query(sqlQuery);
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(port, () => {
    console.log(port);
});

