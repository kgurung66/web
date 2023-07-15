var filesystem = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {
  return new Promise((resolve, reject) => {
    filesystem.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      
      if (err) {
        reject('Unable to read students.json');
        return;
      }

      filesystem.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject('Unable to read courses.json');
          return;
        }

        const students = JSON.parse(studentDataFromFile);
        const courses = JSON.parse(courseDataFromFile);
        dataCollection = new Data(students, courses);

        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject('No results returned');
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {      
      resolve(dataCollection.students.filter(student => student.TA));
    } else {
      reject('No results returned');
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject('No results returned');
    }
  });
}
function addStudent(studentData){
  return new Promise(function (resolve, reject) {
    console.log(studentData)
    studentData.studentNum = dataCollection.students.length + 1;
    studentData.TA = (typeof studentData.TA === 'undefined') ? false : true;
    
    dataCollection.students.push(studentData)

    if(studentData.length == 0){
      reject("No result returned"); 
      return;
    }
    resolve(studentData);
    return
  });
}
module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  addStudent,
};