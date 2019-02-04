const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const mongoUriBuilder = require('mongo-uri-builder');
const Schema = mongoose.Schema;
let User;
const connectionString = mongoUriBuilder({
	username: encodeURIComponent('jsherry'),
	password: encodeURIComponent('Interstellar#1'),
	host: 'ds133166.mlab.com',
	port: 33166,
	database: 'web322_a6',
});
const userSchema = new Schema({
    "userName":{
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});
// initialize the mongoose db
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(connectionString);
        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
            User = db.model("users", userSchema);
            resolve();
        });
    });
};
// Function to register a new user
module.exports.registerUser = function (userData){
    return new Promise(function (resolve, reject) {
        if(userData.password != userData.password2){
            reject ("Passwords do not match");
        }
        else {         
            var newUser = new User(userData);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err){
                        reject("There was an error encrypting the password");
                    }
                    else {
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            resolve();
                        })
                        .catch( (err)=>{
                            if (err.code == 11000){
                                reject("User Name already taken");                 
                            }
                            else {
                                reject("There was an error creating the user: err" + err);
                            };
                        }); 
                    };
                });
            });
        };
    });
};
// Function to varify user
module.exports.checkUser = function (userData){
    return new Promise(function (resolve, reject){
        User.find({
            userName: userData.userName
        })
        .exec()
        .then((found_user)=>{
            bcrypt.compare(userData.password, found_user[0].password)
            .then((res) => {
                found_user[0].loginHistory.push({
                    dateTime: (new Date()).toString(), userAgent: userData.userAgent
                });
                User.update({
                    userName: found_user[0].userName
                },{
                    $set:{
                        loginHistory: found_user[0].loginHistory
                    }
                },{
                    multi: false
                })
                .exec()
                .then( ()=>{
                    resolve(found_user[0]);
                })
                .catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                });
            })
            .catch((err)=>{
                reject("Incorrect Password for user: " + userData.userName);
            })  
        })
        .catch((err)=>{
            reject("Unable to find user: " + userData.userName);
        });
    });
};




