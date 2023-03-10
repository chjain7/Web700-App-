/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Chahat Jain  Student ID: _177139219__ Date: _March 3,2023
*
*  Online (Cycliic) Link: https://real-cyan-millipede-ring.cyclic.app/
*
********************************************************************************/ 

 var HTTP_PORT = process.env.PORT || 8080;
 var express = require("express");
 var app = express();
 const colleged = require('./modules/collegedata.js');
 
 app.use(express.static("public"));
 
 app.use(express.urlencoded({ extended: true }));


 app.get("/students",(req,res)=>{
     var course=req.query.course
     if (typeof course !== 'undefined') {
        
         colleged.getStudentsByCourse(course).then(studentData => {
             res.send(studentData);
           });
       } else {
        colleged.getAllStudents().then(studentData => {
             res.send(studentData);
           });
       }
 });
 
 app.get("/tas",(req,res)=>{
    colleged.getTAs().then(taData => {
         res.send(taData);
       });
 });
 
 app.get("/courses",(req,res)=>{
    colleged.getCourses().then(courseData => {
         res.send(courseData);
       });
 });
 
 app.get("/student/:num",(req,res)=>{
     var num = req.params.num;
     var numValue = parseInt(num);
     colleged.getStudentByNum(numValue).then(studentData => {
         res.send(studentData);
       });
   
 });
 app.post('/students/add',  (req, res) => {
  colleged.addStudents(req.body).then(studentData => {
      res.redirect('/students');
    });
});

 app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(__dirname + '/views/htmlDemo.html');
});
app.get("/students/add", (req, res) => {
  res.sendFile(__dirname + '/views/addStudent.html');
});
 app.get('*', function(req, res){
     res.status(404).send('PAGE NOT FOUND!!!!');
   });
 // setup http server to listen on HTTP_PORT
 app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)
 colleged.initialize()
 });