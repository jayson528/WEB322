/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jayson Sherry________ Student ID: 141056176______ Date: 02/11/2018______
*
* Online (Heroku) Link: https://whispering-anchorage-18919.herokuapp.com/____________
*
********************************************************************************/ 
const exphbs = require('express-handlebars');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const dataService = require('./data-service.js');
const HTTP_PORT = process.env.PORT || 8080;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs', exphbs({ extname:'.hbs', defaultLayout:'main',
    helpers:{
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
}}));
app.set('view engine', '.hbs');
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


// First function to be called when server starts
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////-------ALL GET ROUTES TO DISPLAY WEB PAGES-------//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup a "get" route to display the home page
app.get("/",(req,res)=>{
    res.render('home');
});
// Setup a "get" route to display the home page
app.get("/home",(req,res)=>{
    res.render('home');
});
// Setup a "get" route to display the about page
app.get("/about",(req,res)=>{
    res.render('about');
});
// Setup a "get" route to display the add employees page
app.get("/employees/add",(req,res)=>{
    res.render('addEmployee');
});

// Setup a "get" route to display the add images page
app.get("/images/add",(req,res)=>{
    res.render('addImage');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////-------ALL GET ROUTES TO DISPLAY INFO-------///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup a "get" route to display all employees
app.get("/employees",(req,res)=>{
    if (req.query.status){
        dataService.getEmployeesByStatus(req.query.status) 
        .then((data)=>{
            res.render("employees",{employees:data});
        })
        .catch(()=>{
            res.render({message: "no results"});
        })
    }  
    else if (req.query.department){
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data)=>{
            res.render("employees",{employees:data});
        })
        .catch(()=>{
            res.render({message: "no results"});
        })
    }   
    else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            res.render("employees",{employees:data});
        })
        .catch(()=>{
            res.render({message: "no results"});
        })
    }   
    else{
        dataService.getAllEmployees()
        .then((data)=>{
            res.render("employees",{employees:data});
        })
        .catch(()=>{
            res.render({message: "no results"});
        });
    }
})
// Setup a "get" route to display all departments
app.get("/departments", (req, res) => {
    dataService.getDepartments()
    .then((data) => {
        res.render("departments", {departments: data});
    }).catch((errorMessage) => {
        res.render("departments",{message: "no results"});
    });
});
// Setup a "get" route to display all images
app.get("/images", (req,res) =>{
    fs.readdir("./public/images/uploaded", function(err, data) {
        //res.status(200).json({"images":data});
        res.render('images',{images:data}); 
    });
});
// Setup a "get" route to display employee thats requested
app.get("/employee/:num",(req,res)=>{
    dataService.getEmployeeByNum(req.params.num)
    .then((data)=>{
        res.render("employee",{employee:data});
    })
    .catch(()=>{
        res.render({message: "no results"});
    });
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////-------ALL POST ROUTES TO DISPLAY WEB PAGE-------//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup a "post" route to add a new employee
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body) 
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        console.log("unable to add employee");
    });
});
// Setup a "post" route to update employee
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");});
    //res.redirect("/employees");
});
// Setup a "post" route to add a new image
app.post("/images/add", upload.single(("imageFile")), (req, res) => {
    res.redirect("/images");
});



app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})

dataService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log("error: " + err);
});