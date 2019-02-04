/*********************************************************************************
* WEB322: Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jayson Sherry___ Student ID: 141056176______ Date: 07/09/2018________
*
* Online (Heroku) URL: https://aqueous-refuge-75258.herokuapp.com/____________
*
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Jayson Sherry - 141056176");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);