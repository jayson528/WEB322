/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jayson Sherry________ Student ID: 141056176______ Date: 25/11/2018______
*
* Online (Heroku) Link: https://whispering-anchorage-18919.herokuapp.com/____________
*
********************************************************************************/ 
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var dataService = require('./data-service.js');
var HTTP_PORT = process.env.PORT || 8080;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
var upload = multer({ storage: storage });
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
    }
}));
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
/////////////////////////////-------ALL GET ROUTES-------///////////////////////////////////////////////////////////
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
// Setup a "get" route to display all employees
app.get("/employees",(req,res)=>{
    if (req.query.status){
        dataService.getEmployeesByStatus(req.query.status) 
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else {
        dataService.getAllEmployees()
        .then((data)=>{
            if(data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        });
    }
})
// Setup a "get" route to display the add employees page
app.get("/employees/add",(req,res)=>{
    dataService.getDepartments()
    .then((data) =>{
        res.render('addEmployee',{Departments: data});
    })
    .catch(()=> {
        res.render('addEmployee',{Departments:[]});
    })   
});
// Setup a "get" route to display employee thats requested
app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    })
    .catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    })
    .then(dataService.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching
        // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    })
    .catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
});
// Setup a "get" route to delete an employee
app.get("/employees/delete/:num",(req,res)=>{
    dataService.deleteEmployeeByNum(req.params.num)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
});
// Setup a "get" route to display all departments
app.get("/departments",(req,res)=>{
    dataService.getDepartments()
    .then((data)=>{
        if (data.length > 0) {
            res.render("departments", {Departments: data});
        } else {
            res.render("departments",{message: "no results"});
        }
    })
    .catch(()=>{
        res.render("departments",{message: "no results"});
    });
});
// Setup a "get" route to display the add departments page
app.get('/departments/add', (req, res) => {
    res.render('addDepartment')
});
// Setup a "get" route to display the department thats requested
app.get('/department/:departmentId', (req, res) => {
    dataService.getDepartmentById(req.params.departmentId)
    .then((data) => {
        res.render("department",{department:data}); 
    })
    .catch(() => {
        res.status(404).send("Department Not Found");
    })
});
// Setup a "get" route to delete a department
app.get("/departments/delete/:departmentId",(req,res)=>{
    dataService.deleteDepartmentById(req.params.departmentId)
    .then(()=>{
        res.redirect("/departments");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Department / Department not found");
    })
});
// Setup a "get" route to display all images
app.get("/images", (req,res) =>{
    fs.readdir("./public/images/uploaded", function(err, data) {
        res.render('images',{images:data}); 
    });
});
// Setup a "get" route to display the add images page
app.get("/images/add",(req,res)=>{
    res.render('addImage');
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////-------ALL POST ROUTES-------//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup a "post" route to add a new employee
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to add Employee");
    });
});
// Setup a "post" route to update employee
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Update Employee");
    })
});
// Setup a "post" route to add a new department
app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body)
    .then(() => {
        res.redirect("/departments")
    })
    .catch(()=>{
        res.status(500).send("Unable to to add Department");
    });
});
//Setup a "post" route to update a department
app.post("/departments/update", (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    })
    .catch(()=>{
        res.status(500).send("Unable to update department");
    })
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
