var mongoose = require('mongoose') ;
var categorySchema = new mongoose.Schema({
    category: {type: String, required: true},
    lesson: [{type: mongoose.Schema.Types.ObjectId, ref: "Lesson"}],
    jDate:{type:Date, require:true},
}, { timestamps: true });
module.exports = mongoose.model("Category" , categorySchema ) ;