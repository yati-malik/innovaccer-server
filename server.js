const express = require('express');
const {Pool, Client} = require('pg');
const app = express();
const port = 3000;

// const client = new Client({
//     user: "niwkmjfkppddzt",
//     host: "ec2-54-157-88-70.compute-1.amazonaws.com",
//     database: "df5kk7bhepua7e",
//     password: "9c7903713a043f5eb096558d9cb12a778c6e0c368f4ffe1d5f3ae5e202a73d9d",
//     port: "5432",
//     ssl: true
//   });

const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "a",
        port: "5432"
      });

client.connect();

app.get('/patients',(req,res) => {
    res.send('Hi');
})

app.get('/getAllName',(req,res)=>{
    let jsonObj = [{
        name: 'yati',
        lastname: 'Malik'
    },{
        name: 'Richa',
        lastname: 'Chaudhary'
    }];
    res.send(jsonObj);
});

app.post('/patients',(req,res) => {
    client.query(
        "INSERT INTO PATIENTS(NAME, AGE, GENDER, CONTACT)VALUES('Mary Ann', 20, 'Male', '8888888888')",
        (err, resp) => {
          client.end();
          console.log(err,resp);
        }
      );
      res.send('Hi');
})


app.listen(port, ()=> {
    console.log(process.env.DATABASE_URL);
})