var mongoose = require('mongoose') ;
var practiceSchema = new mongoose.Schema({
    firstPic: {type: String, require: true},
    secondPic: {type: String, require: true},
    jDate:{type:Date, require:true},
    options: [{
        option:{type:String}//gozine ha
    }],
    trueOption:{type:String, required:true},
}, { timestamps: true });
module.exports = mongoose.model("Practice" , practiceSchema ) ;