const Sequelize = require('sequelize');
var sequelize = new Sequelize('dcrj5ng3v9bla2', 'tmewurekbikeey', '892225d8dc26db16d6fba575c33a7c99c0d29c41184fc62d93170171a2ff7f94', {
 host: 'ec2-107-20-193-206.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
 }
});
// Authenticate sequelize and display message
sequelize.authenticate()
.then(function() {
    console.log('Connection has been established successfully.');
}).catch(function(err) {
    console.log('Unable to connect to the database:', err);
});
// Create new Employee Modle(table), if one does not exist
var Employees = sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});
// Create new Department Modle(table), if one does not exist
var Departments = sequelize.define('Departments',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});
// Set the relationship(A Department could have many Employees) between the two tables
Departments.hasMany(Employees, {foreignKey: 'department'});
// Initialize will call a function to "sync" the DataBase
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=>{
            resolve("database sync complete");
        }).catch(()=>{
            reject("unable to sync the database");
        });
    });
};
// Function to find all employees
module.exports.getAllEmployees = function (){
    return new Promise(function (resolve, reject) {
        Employees.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};
// Function to find employees based on satus
module.exports.getEmployeesByStatus = function (status){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                status:status
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
// Function to find employees based on department
module.exports.getEmployeesByDepartment = function (department){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                department:department
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
// Function to find employees based on manager
module.exports.getEmployeesByManager = function (manager){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                employeeManagerNum:manager
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
// Function to find employees based on employee number
module.exports.getEmployeeByNum = function (num){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                employeeNum:num
            }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};

// Function to find all departments
module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Departments.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};
// Function to add employee to database
module.exports.addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        };
        Employees.create(employeeData)
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create employee");
        });   
    });
};
// Function to update employee data
module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        };
        Employees.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        });   
    });
};
// Function to add new department
module.exports.addDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        };
        Departments.create(departmentData)
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create department");
        });   
    });
};
// Function to update department
module.exports.updateDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        };
        Departments.update(departmentData, {
            where: {
                departmentId: departmentData.departmentId
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to update department");
        });   
    });
};
// Function to get departments based on id
module.exports.getDepartmentById = function (id){
    return new Promise(function (resolve, reject) {
        Departments.findAll({
            where:{
                departmentId: id
            }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};
// function to delete a department based on id
module.exports.deleteDepartmentById = function(id){
    return new Promise(function(resolve,reject){
        Departments.destroy({
            where:{
                departmentId: id
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
};
// Function to delete employee based on number
module.exports.deleteEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        Employees.destroy({
            where:{
                employeeNum: num
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
};