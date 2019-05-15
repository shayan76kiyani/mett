var mongoose = require('mongoose') ;
var lessonSchema = new mongoose.Schema({
    category : {type: String, require: true},
    subject : {type: String, require: true},
    content : { type: String, required: true },
    pic: { type: String },
    jDate:{type:Date, require:true},
}, { timestamps: true });
module.exports = mongoose.model("Lesson" , lessonSchema ) ;