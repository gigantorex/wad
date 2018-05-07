const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/studentmis');

const Student = mongoose.model('Student', { 
  student_id: Number,
  first_name: String,
  last_name: String,
  dob: String, 
  address: String, 
  gender: String, 
  semester: String
});

const app = express();

app.use('/', express.static('public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/addStudents', urlencodedParser, 
  function (req, res) {
  if ( 
    req.body && 
    req.body.student_id && 
    req.body.student_id != '' 
    ) {
    Student.findOne({'student_id':req.body.student_id}, 
      function (err, exists) {
        if (err)
          throw err;
        if ( exists ) {
          var result = {
            message: 'Student Id already exists'
          }
          res.json(result);
        } else {
          var student = new Student();
          student.student_id = req.body.student_id;
          student.first_name = req.body.first_name;
          student.last_name = req.body.last_name;
          student.dob = req.body.dob;
          student.address = req.body.address;
          student.gender = req.body.gender;
          student.semester = req.body.semester;
          student.save(function (err, addedStudent) {
            if (err)
              throw err;
            var result = {
              message: 'Student saved successfully',
              data: addedStudent
            }
            res.json(result);
          });
        }
    })

  } else {
    res.end('Invalid request');
  }
});

// localhost:8080/getStudent/5ad0c71fde1de4051c02b029
app.get('/getStudent/:id', function (req, res) {
  Student.findOne({'_id': req.params.id}, 
    function ( err, student ) {
      if (err)
        throw err;
      var result = {}
      if (student) {
        result = {
          'message': 'student found successfully',
          data: student
        }
      } else {
        result = {
          'message': 'student doesn\'t found'
        }
      }
      res.json(result);
  });
});

// localhost:8080/editStudent/57622
app.post('/editStudent/:id', urlencodedParser,
  function (req, res) {
  if ( 
    req.body && 
    req.body.first_name && 
    req.body.first_name != '' 
    ) {
    Student.findOne({'_id': req.params.id}, 
      function ( err, student ) {
        if (err)
          throw err;
        var result = {};
        if (student) {
          
          student.first_name = req.body.first_name;
          student.last_name = req.body.last_name;
          student.dob = req.body.dob;
          student.address = req.body.address;
          student.gender = req.body.gender;
          student.semester = req.body.semester;
          student.save(function ( err, saved_student ) {
            if (err)
              throw err;

            result = {
              'message': 'student updated successfully'
            }
            res.json(result);
          });
          
        } else {
          result = {
            'message': 'student doesn\'t found'
          }
          res.json(result);
        }
        
    });
  } else {
    var result = {
      message: 'Invalid reques'
    };
    res.json(result);
  }
});

app.get('/getStudents', function (req, res) {
  Student.find({}, 
    function ( err, students ) {
      if (err)
        throw err;
      var result = {}
      if (students.length > 0) {
        result = {
          'message': 'students found successfully',
          data: students
        }
      } else {
        result = {
          'message': 'no students were found'
        }
      }
      res.json(result);
  });
});

app.listen(8080, function () {
  console.log('Server started at 8080');
})