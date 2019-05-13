//jshint esversion:6

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/shopDB", {useNewUrlParser: true});

const CourseSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Every course has a name']
  },
  code:{
    type: String,
    required: [true, 'Every course has a code']
  },
  teacher: String
});

const StudentSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Every student has a name']
  },
  number: {
    type: Number,
    required: [true, 'Every student has a number']
  },
  courses: [CourseSchema]
});

const Course = mongoose.model("Course", CourseSchema);
const Student = mongoose.model('Student', StudentSchema);

const course = new Course({
  name: "ISS",
  code: "ASH 427",
  teacher: "Jackson"
});

//course.save();

const student = new Student({
  name: "Yoofi Brown-Pobee",
  number: 0248506381,
  courses: [course]
});

//student.save();
/*Student.updateOne({name: "Yoofi Brown-Pobee"}, {$push: {courses: course}}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Success!");
  }
});*/

Course.updateOne({_id: "5cad0b705c26fa666183f286"}, {teacher: "Isaac"}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Success!");
  }
});
