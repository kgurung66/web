
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Kalpana Gurung Student ID: 131447229 Date: 2023/07/14
* Online (Cyclic) Link: https://wicked-yoke-ant.cyclic.app/

*
********************************************************************************/ 


var collegeData = require('./collegeData');
var express = require("express");
var app = express();
var path = require('path');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({ extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
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
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
   });


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get('/', (req, res) => {
    res.render('home'); // Render the "home" view using handlebars template
  });
  

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get("/addStudent", (req, res) => {
    res.render('addStudent');
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(
        res.redirect('/students')
    ).catch(function(reason){
        console.log(reason);
});
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then(
        res.redirect('/students')
    ).catch(function(reason){
        console.log(reason);
    });
   });

app.get("/students", function(req,res){
    collegeData.getAllStudents().then( (data) => {
        res.render("students",
                    {students: data});
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
        res.render("courses",
        {courses: data});
    }).catch((reason)=>{
        res.send(reason);
    })
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then(
    function (data) {   
        res.render("course", {course: data});

      }
    ).catch(function(reason){
        console.log(reason);
});
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then(

        
    function (studentData) {  
        collegeData.getCourses().then(
            function (coursesData) {
                res.render("student",
                        {student: studentData,
                        courses: coursesData});
    
              }
            ).catch(function(reason){
                console.log(reason);
        });             
      }
    ).catch(function(reason){
        console.log(reason);
});
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
