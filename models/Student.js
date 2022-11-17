const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const studentSchema = new Schema({
    id: {type:Number, required:true, unique:true},
    name: {type:String, require:true},
    currentClass: {type:String, require:true},
    division: {type:String, require:true}
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;