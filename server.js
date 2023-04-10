/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Chahat Jain  Student ID: _177139219__ Date: _March 23,2023
*
*  Online (Cycliic) Link: https://fine-plum-chimpanzee-wig.cyclic.app
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require('express-handlebars')
const handlebars = require('handlebars');



var app = express();
const colleged = require('./modules/collegeData.js');

app.use(express.static("public"));


handlebars.registerHelper('ifEqual', function(a, b, options) {
 if (a === b) {
   return options.fn(this);
 } else {
   return options.inverse(this);
 }
});


app.use(function (req, res, next) {
 let route = req.path.substring(1);
 app.locals.activeRoute = "/" + (isNaN(route.split('/')[1])
   ? route.replace(/\/(?!.*)/, "")
   : route.replace(/\/(.*)/, ""));
 next();
});





app.use(express.urlencoded({ extended: true }));
// Configure express-handlebars
app.engine(".hbs", exphbs.engine({ extname: ".hbs" ,helpers: {
 navLink: function (url, options) {
   return (
     '<li' +
     ((url == app.locals.activeRoute)
       ? ' class="nav-item active" '
       : ' class="nav-item" ') +
     '><a class="nav-link" href="' + url + '">' +
     options.fn(this) + '</a></li>'
   );
 },
 equal: function (lvalue, rvalue, options) {
   if (arguments.length < 3) {
     throw new Error("Handlebars Helper equal needs 2 parameters");
   }
   if (lvalue != rvalue) {
     return options.inverse(this);
   } else {
     return options.fn(this);
   }
 }
}}));
app.set("view engine", ".hbs");


//  app.get("/students",(req,res)=>{
//      var course=req.query.course
//      if (typeof course !== 'undefined') {
       
//          colleged.getStudentsByCourse(course).then(studentData => {
//              res.send(studentData);
//            });
//        } else {
//         colleged.getAllStudents().then(studentData => {
//              res.send(studentData);
//            });
//        }
//  });

app.get("/students",(req,res)=>{
 var course=req.query.course
 if (typeof course !== 'undefined') {
    
     colleged.getStudentsByCourse(course).then(studentData => {
       res.render("students", {students: studentData});
       });
   } else {
     colleged.getAllStudents().then(studentData => {
       res.render("students", {students: studentData});
       });
   }
});



//  app.get("/tas",(req,res)=>{
//     colleged.getTAs().then(taData => {
//          res.send(taData);
//        });
//  });

//  app.get("/courses",(req,res)=>{
//     colleged.getCourses().then(courseData => {
//          res.send(courseData);
//        });
//  });

app.get("/courses", (req, res) => {
 colleged.getCourses()
   .then(data => {
     res.render("courses", {courses: data});
   })
   .catch(err => {
     res.render("courses", { message: "no results" });
   });
});
app.get('/courses/add', (req, res) => {
  res.render('addCourse')
})

app.post('/courses/add', (req, res) => {
  colleged.addCourse(req.body)
    .then(res.redirect('/courses'))
})

app.post('/courses/update', (req, res) => {
  colleged.updateCourse(req.body)
    .then(
      res.redirect("/courses"))
})

app.get('/students/add', function (req, res) {
  res.render('addStudent')

});

app.post('/students/add', function (req, res) {

  colleged
    .addStudent(req.body)
    .then(function () {
      res.redirect("/students");
    })
    .catch(function () {
      console.log("Error while aading student");
    });

});

app.get("/course/:id", (req, res) => {
  if (req.params.id <= 0) {
    res.send("No results");
  } else {
    colleged.getCourseById(req.params.id)
      .then((foundCourse) => {
        if (foundCourse) {
          res.render('course', { course: foundCourse });
        } else {
          res.status(400).send("Course Not Found");
        }
      }).catch(() => {
        res.render('course', { message: "No Results" });
      });
  }
});

app.get("/course/delete/:id", (req, res) => {
  colleged
    .deleteCourseById(req.params.id)
    .then(function () {
      res.redirect("/courses");
    })
    .catch(function () {
      res.status(500).send("Unable to Remove Course/Course Not Found");
    });
});

app.get('/students/:num', (req, res) => {
  let viewData = {};

  data.getStudentByNum(req.params.num).then((data) => {
    if (data) {
      viewData.student = data;
    } else {
      viewData.student = null;
    }
  }).catch(() => {
    viewData.student = null;
  }).then(data.getCourses)
    .then((data) => {
      viewData.courses = data; 
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }

    }).catch(() => {
      viewData.courses = []; 
    }).then(() => {
      if (viewData.student == null) {
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); 
      }
    });
})

app.get("/student/delete/:num", (req, res) => {
  colleged
    .deleteStudentByNum(req.params.num)
    .then(function () {
      res.redirect("/students");
    })
    .catch(function () {
      res.status(500).send("Unable to Remove Student/Student Not Found");
    });
});

app.get("/student/:num", (req, res) => {
 // Call the getStudentByNum function with the "num" parameter from the URL
 colleged.getStudentByNum(req.params.num).then((result) => {
     // Return the result as a JSON response
     res.render("student", { student: result }); 
 }).catch((err) => {
     // If there is an error, return a JSON response with a message of "no results"
     return res.json({message:"no results"})
 }); 
});

app.get("/course/:id", (req, res) => {
 var num = req.params.num;
 var numValue = parseInt(num);
 colleged.getCourseById(numValue)
   .then(data => {
     res.render("course", { course: data });
   })
   .catch(err => {
     res.render("error", { message: err.message });
   });
});


// app.post('/students/add',  (req, res) => {
//  colleged.addStudent(req.body).then(data => {
//      res.redirect('/students');
//    });
// });

app.get("/", (req, res) => {
   res.render(__dirname + '/views/home.hbs');
});

app.get("/about", (req, res) => {
   res.render(__dirname + '/views/about.hbs');
});

app.get("/htmlDemo", (req, res) => {
   res.render(__dirname + '/views/htmlDemo.hbs');
});

app.get("/students/add", (req, res) => {
 res.render(__dirname + '/views/addStudent.hbs')
});

app.post('/students/add',  (req, res) => {
 colleged.addStudent(req.body).then(studentData => {
     res.redirect('/students');
   });
});

app.post("/student/update", (req, res) => {
 colleged.updateStudent(req.body)
   .then(() => {
     res.redirect("/students");
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send("Error updating student");
   });
});


app.get('*', function(req, res){
    res.status(404).send('PAGE NOT FOUND!!!!');
  });
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)
colleged.initialize()
});