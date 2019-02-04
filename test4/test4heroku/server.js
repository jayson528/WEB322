const express = require('express');
const pg = require("pg");
const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
// home page to show emp 1
app.get('/', function (req, res, next) {
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
    client.query('SELECT * FROM Employee where empid = $1',
[1],function(err,result) {
        done(); // closing the connection;
        if(err){
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
        });
    });
});

app.get('/pool', function (req, res) {
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
        client.query('select * from getallemployee()' ,function(err,result) {
            done();
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

app.get('/sp', function (req, res) {
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
        client.query('select * from getallemployee()' ,function(err,result) {
            done();
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

function onHttpStart() {
    console.log("Server is running.. on Port  " + HTTP_PORT);
  }
app.listen(HTTP_PORT, onHttpStart);