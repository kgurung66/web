
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Kalpana Gurung Student ID: 131447229 Date: 2023/06/14
*
********************************************************************************/ 


var collegeData = require('./collegeData');
var express = require("express");
var app = express();
var path = require('path');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){

    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
app.get("/htmlDemo", function(req,res){
    res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
});

app.get("/addStudent", (req, res) => {
    res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(
        res.redirect('/students')
    ).catch(function(reason){
        console.log(reason);
});
});

app.get("/students", function(req,res){
    collegeData.getAllStudents().then( (data) => {
        res.send(data);
    }).catch((reason)=>{
        res.send(reason);
    })
});

app.get("/tas", function(req,res){
    collegeData.getTAs().then( (data) => {
        res.send(data);
    }).catch((reason)=>{
        res.send(reason);
    })
});

app.get("/courses", function(req,res){
    collegeData.getCourses().then( (data) => {
        res.send(data);
    }).catch((reason)=>{
        res.send(reason);
    })
});



app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"/views/pnf.html"));
  });



collegeData.initialize().then(() =>{
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch(error => {
    console.log(error);
});

// app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
