var express = require('express');
var mongoose = require('mongoose');
var bodyparse= require('body-parser');

var Student = new mongoose.Schema({
	
	student_id:String,
	first_name:String,
	last_name:String,
	date:Date,
	course_id:[[String]]

});
var result;
var app = express();
app.use('/',express.static('public'));

mongoose.connect('mongodb://localhost:27017/practice');

app.get('/listStudents',function(req,res){
	Student.find({},function (err,students) {
	if(err){
	console.log('student find');
	}	
	else{
	res.json(students);
	}
})
});
app.post('/addStudents',function(req,res){

	if(req.body && req.body.id !=''){
	Student.findOne({'id':req.body.id},function(err,studen){
	if(err)
	{
	var result={
	'message':'Student Not Found'
	}
	res.json(result);
	}
	var student = new Student();
	student.id =req.body.id;
	student.first_name = req.body.fname;
	student.last_name = req.body.lname;
	student.date=req.body.date;
	student.save(function(err,addStudent){
	if(err)
	{
		console.log("Error add student");
	}else{
		result={
	'message': 'Student Saved successfully',
	 data:addStudent
	}	
	}	
})
	})
}


})

app.listen(8080,function(){
	console.log("Listening at Port :8080");
})
