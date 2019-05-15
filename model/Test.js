var mongoose = require('mongoose') ;
var testSchema = new mongoose.Schema({
    pic: {type: String, require: true},
    jDate:{type:Date, require:true},
    options: [{
        option:{type:String}//gozine ha
    }],
    trueOption:{type:String, default: ""},
}, { timestamps: true });
module.exports = mongoose.model("Test" , testSchema ) ;