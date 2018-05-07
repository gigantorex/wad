
var mongoose = require('mongoose');
var express = require('express');
var bodyparser=require('body-parser');
var student=require('./models/Student');
var course=require('./models/Course');





var app=express();
 var cwd = process.cwd();
app.use('/',express.static('public'));

mongoose.connect('mongodb://localhost/assg3');
var urlencodedparser=bodyparser.urlencoded({extended:false});

app.get('/students',function (req,res) {
    student.find({},function (err, students) {
        if (err) {
           console.log(err);
        }

        else{
         
          res.json(students);
        }
    
    }
)
});

app.get("/addstudent", function(req, res) {
  res.sendFile(cwd + '/public/index.html');
});
app.get("/liststudent", function(req, res) {
  res.sendFile(cwd + "/public/list.html");
});
app.post("/addstudent", urlencodedparser, function(req, res) {
  var mydata = new student(req.body);
  mydata.save(function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      res.end("Student has been saved");
    
    }
  });
});

app.get('/edit/:id',function (req,res) {
    student.findOne({ _id: req.params.id }).exec(function (err,respond) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else{
            res.json(respond);

        }
    });
});

app.post("/update/:id", urlencodedparser, function(req, res) {
   
    var query = { student_id: req.body.student_id };
     console.log("Student update called");
     var newSt = new student(req.body);
     console.log(req.params.id);
 student.findOne({_id:req.params.id},function (err,data) {
   if (err) {console.log(err); }
   if (data) {
     data.student_id = req.body.student_id;
     data.first_name = req.body.first_name;;
     data.last_name = req.body.last_name;
     data.email=req.body.email;
     data.program=req.body.program
     data.save(function (err,saved) {

      if (err) {console.log('err updating/save student info') }
      else{res.send(saved);}
       
     })  
   }
   
 })

});

app.post("/delete/:id", urlencodedparser, function(req, res) {
  console.log(req.params.id);
   console.log('Delete cl');
  student.remove({ _id: req.params.id }).exec(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted");
      res.redirect("http://localhost:8080/liststudent");
    }
  });
});

app.get('/enroll',function (req,res) {
    res.sendFile(cwd+'/public/enroll.html');
});

app.post('/enroll',urlencodedparser,function (req,res) {
  
   var query = {student_id: req.body.student_id  };
  
   student.update(
     query,
     { $push: { course_id: req.body.course_id } },
     { safe: true, upsert: true },
     function(err, doc) {
       if (err) {
         console.log(err);
       } else {
         console.log(doc);
         res.send("Enrolled");
       }
     }
   );
});


app.get("/courses", function(req, res) {
  course.find({}, function(err, courses) {
    if (err) {
      console.log(err);
    } else {
          

             res.json(courses);
           }
  });
});
app.get("/listcourse", function(req, res) {
  res.sendFile(cwd + "/public/course/list.html");
});
app.get("/addcourse", function(req, res) {
  res.sendFile(cwd + "/public/course/index.html");
});

app.post("/addcourse", urlencodedparser, function(req, res) {
  var mydata = new course(req.body);
  mydata.save(function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      res.end("Course has been saved");
      }
  });
});

app.get("/editcourse/:id", function(req, res) {
  course.findOne({ _id: req.params.id }).exec(function(err, respond) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(respond);
    }
  });
});

app.post("/updatecourse/:id", urlencodedparser, function(req, res) {
  console.log("update Called");
  console.log("Balay balayu", req.params.id);
  course.findOne({_id:req.params.id},function (err,data) {
    if (err) {console.log(err);}
    if (data) {
      data.course_id = req.body.course_id;
      data.course_title = req.body.course_title;
      data.save(function(err, saved) {
        
      if (err) {
        console.log("err updating/save Course info");
      } else {
        res.send(saved);
      }
      });
    }
  })
});

app.post("/deletecourse/:id", function(req, res) {
  course.remove({ _id: req.params.id }).exec(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted");
      res.redirect("/course");
    }
  });
});

app.listen(3000,function () {
    console.log('Local hosting service :3000');
});