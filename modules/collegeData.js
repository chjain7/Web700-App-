const path = require('path');

class Data {
    constructor(students,courses) {
        this.students = students;
        this.courses = courses;
    }
}


var dataCollection = null;
const currentDirectory = process.cwd();



const initialize = () => {
    return new Promise((resolve, reject) => {
        const fs = require('fs');


        var StudentPath = currentDirectory + "/data/students.json";
        var CoursePath = currentDirectory + "/data/courses.json";


        //reading Student.json file from data folder
        var StudentDataFromFile = () => JSON.parse(fs.readFileSync(StudentPath, "UTF8"));

        //reading courses.json file from data folder
        var CourseDataFromFile = () => JSON.parse(fs.readFileSync(CoursePath, "UTF8"));

        //Passing the data of student and courses to data Collection
        dataCollection = new Data(StudentDataFromFile(), CourseDataFromFile())

        resolve("initialize complete");
    })

}


const getAllStudents = () => {
    return new Promise((resolve, reject) => {

        if (dataCollection.length === 0)
            reject("no results returned");

        else
            resolve(dataCollection.students)

    })
}

const getCourses = () => {
    return new Promise((resolve, reject) => {

        if (dataCollection.length === 0)
            reject("no results returned");

        else
            resolve(dataCollection.courses)

    })
}

const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {

        const matchingStudents = dataCollection.students.filter(student => student.course == course);
        if (matchingStudents.length === 0) {
            reject(`No results returned for course ${course}`);
        } else {
            resolve(matchingStudents);
        }

    })
}
const getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        const matchingStudent = dataCollection.students.find(student => student.studentNum == num);
        if (!matchingStudent) {
            reject(`No results returned for studentNum ${num}`);
        } else {
            resolve(matchingStudent);
        }
    });
}

const getTAs = () => {
    return new Promise((resolve, reject) => {

        if (dataCollection.length != 0) {
            var obj = [];
            for (let i = 0; i < dataCollection.students.length; i++) {
                if (dataCollection.students[i]["TA"] != false)
                    obj.push(dataCollection.students[i])

            }
            resolve(obj)

        } else
            reject(new Error("Error While Fetching Data!!!"));

    })
}
const addStudents = function(StudentDataFromFile){
    return new Promise(function (resolve, reject) {
 StudentDataFromFile.TA = StudentDataFromFile.TA === undefined ? false : true;
    var studentNum = dataCollection.students.length + 1;
    StudentDataFromFile.studentNum = studentNum;

    dataCollection.students.push(StudentDataFromFile);

    resolve(dataCollection);
    });

}
const getCourseById = (id) => {
    return new Promise(async function(Resolve, Reject) { 
         try{
             
              if(id == undefined) {
                   Reject("Id parameter Not present")
              }

              // Filter the course to only whos courseId = id
              let filter = (!dataCollection || dataCollection.courses == undefined)? [] : dataCollection.courses.filter(x => x.courseId == id);
              
              
              if(!dataCollection || dataCollection.courses == undefined) {
                   Reject("No Object is not initialized")
              }

            
              if(filter.length == 0) {
                   Reject("query returned 0 results")
              }
             
              else{
                   Resolve(filter[0])
              }
         }catch (err){
              
              Reject(err.message)
         }
    })
};

const updateStudent = (data) => {
    return new Promise(async function(Resolve, Reject) { 
         try{
             
              if(!dataCollection || dataCollection.students == undefined) {
                   Reject("Student does not exist")
              }
              
              if(data.TA) {
                   data.TA = true;
              }
              else{
                   Object.assign(data,{TA:false});
              }
              
              const index = dataCollection.students.findIndex(x => x.studentNum == data.studentNum);
              if (index !== -1) {
                   dataCollection.students[index] = data;
              }

              
              Resolve("Successfully updated the student Information")
              
         }catch (err){
              
              Reject(err.message)
         }
    })
};
  

module.exports = {
    getStudentsByCourse,
    getStudentByNum,
    initialize,
    getCourses,
    getAllStudents,
    getStudentsByCourse,
    getTAs,
    addStudents,
    getCourseById,
    updateStudent
};