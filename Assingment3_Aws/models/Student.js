var mongoose = require('mongoose');

var studentSchemma = new mongoose.Schema({
  student_id: String,
  first_name: String,
  last_name: String,
  email: String,
  program: String,
  course_id:[[String]]

  
});
module.exports=mongoose.model("Students",studentSchemma);