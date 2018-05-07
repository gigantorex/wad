var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
  course_id: String,
  course_title: String
});

module.exports = mongoose.model("course", courseSchema);
