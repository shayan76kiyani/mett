var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Lesson = require('../../model/Lesson');
var Category = require('../../model/Category');

/* GET users listing. */
router.get('/admin/add-lesson', function(req, res) {
    Category.find().sort({_id:-1}).then(function(category) {
        if (category) {
            res.render('admin/addLesson', { title: 'addLesson', categories: category, Lesson:true });
        }else{
            res.render('admin/addLesson', { title: 'addLesson', categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'], Lesson:true });
        }
    });
});

router.post('/admin/add-lesson', function( req,res){
    console.log(req.body);
    Lesson.create({
        subject: req.body.Subject,
        content: req.body.Content,
        pic: req.body.pic,
        jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        category: req.body.Category,
    },function(err,lesson){
        if(err){
            console.log(err);
            res.render('admin/addLesson', { title: 'addLesson' ,msg: err });
        } else {
            Category.findOne({category: req.body.Category}, function (err, category) {
                if (err) return res.status(500).send(err);
                if (!err){
                    category.lesson.push(lesson._id);
                    category.save(function(err, data){
                        if(err){ console.log(err);}
                        if(!err){
                            Category.find().sort({_id:-1}).then(function(category) {
                                if (category) {
                                    res.render('admin/addLesson', { title: 'addLesson', categories: category, msg: "saved", lesson: lesson});
                                }else{
                                    res.render('admin/addLesson', { title: 'addLesson', categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'], msg: "saved", lesson: lesson });
                                }
                            });
                        }
                    })
                }
            });
        }
    });
});

module.exports = router;
