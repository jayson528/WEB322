const express = require('express');
const pg = require("pg");
const app = express();
//const connectionString = "postgres://postgres:JAyson528@localhost:5433/postgres";
const config = {
    user: 'postgres',
    database: 'postgres',
    password: 'JAyson528',
    port: 5433,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);

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

app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
});






