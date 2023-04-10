const Sequelize = require('sequelize');
var sequelize = new Sequelize('vvpuobof', 'vvpuobof', 'AtmOMVzqxLD2RjnzrT9sJikE7SMEu637', {
    host: 'salt.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


var Student = sequelize.define("Student", {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,});

var Course = sequelize.define("Course", {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,},
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,});

Course.hasMany(Student, { foreignKey: "course" });



module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize
            .sync()
            .then(function () {
                resolve("Operation was a success");
            })
            .catch(function () {
                reject("Unable to sync the database (from initialize)");
            });
    });
}

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        Student.findAll()
            .then(function (students) {
                resolve(students);
            })
            .catch(function () {
                reject("no results returned (from getallStudents)");
            });
    });
}

module.exports.getStudentsByCourse = function (course) {
    console.log(typeof course);
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                course,
            },
        })
            .then(function (students) {
                resolve(students);
            })
            .catch(function () {
                reject("no results returned (from getStudentsBYCourse)");
            });
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where: {
                num,
            },
        })
            .then(function (students) {
                resolve(students[0]);
            })
            .catch(function () {
                reject("no results returned (from getStudentByNum)");
            });
    });
};

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        Course.findAll()
            .then(function (courseList) {
                resolve(courseList);
            })
            .catch(function () {
                reject("no results returned (from getCourses)");
            });
    });

};


module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        Course.findAll({
            where: {
                courseId,
            },
        })
            .then(function (courseList) {
                resolve(courseList[0]);
            })
            .catch(function () {
                reject("no results returned (from getCourseById)");
            });
    });
}


module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        const payload = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA ? true : false,
            status: studentData.status,
            course: studentData.course,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Student.create(payload)
            .then(function () {
                resolve("Students Successfully added");
            })
            .catch(function () {
                reject("Unable to create student");
            });
    });

};

module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        const payload = {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA ? true : false,
            status: studentData.status,
            course: studentData.course,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Student.update(payload, {
            where: { studentNum: studentData.studentNum },
        })
            .then(function () {
                resolve("Students Successfully updated");
            })
            .catch(function () {
                reject("Unable to update student");
            });
    });

};


module.exports.addCourse = function (course) {
    console.log(course);
    return new Promise(function (resolve, reject) {
        const payload = {
            courseCode: course.courseCode,
            courseDescription: course.courseDescription,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Course.create(payload)
            .then(function () {
                resolve("Course Successfully added");
            })
            .catch(function () {
                reject("Unable to create course");
            });
    });
}


module.exports.updateCourse = function (course) {
    return new Promise(function (resolve, reject) {
        const payload = {
            courseCode: course.courseCode,
            courseDescription: course.courseDescription,
        };
        for (let key in payload) {
            if (payload[key] == "") {
                payload[key] = null;
            }
        }
        Course.update(payload, {
            where: { courseId: course.courseId },
        })
            .then(function () {
                resolve("Course Successfully updated");
            })
            .catch(function () {
                reject("Unable to update course");
            });
    });
}


module.exports.deleteCourseById = function (courseId) {
    return new Promise(function (resolve, reject) {
        Course.destroy({
            where: { courseId },
        })
            .then(function () {
                resolve("Course Successfully deleted");
            })
            .catch(function () {
                reject("Unable to delete course");
            });
    });
}

module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
        Student.destroy({
            where: { studentNum },
        })
            .then(function () {
                resolve("Student Successfully deleted");
            })
            .catch(function () {
                reject("Unable to delete student");
            });
    });
}
