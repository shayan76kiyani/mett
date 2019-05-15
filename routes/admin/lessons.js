var express = require('express');
var router = express.Router();

var Lesson = require('../../model/Lesson');

/* GET users listing. */
router.get('/admin/lessons', function(req, res) {
    Lesson.find().sort({_id:-1}).then(function(lesson) {
        console.log(lesson);
        if (!lesson) {
            res.json( { status : 404 , msg : "cant find any lesson" });
        }
        if (lesson) {
            res.render('admin/lesson', { title: 'Lessons', Lessons: lesson });
        }
    });
});
router.post('/admin/lessons',function(req, res){
    console.log(req.body );
    Lesson.findByIdAndRemove(req.body.id, (err, lesson) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Lesson successfully deleted",
            id: lesson._id
        };
        return res.status(200).send(response);
    });
});

module.exports = router;
