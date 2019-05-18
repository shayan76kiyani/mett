var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Lesson = require('../../model/Lesson');
var Category = require('../../model/Category');

router.get('/admin/lesson/:id', function(req, res, next) {

    Lesson.findById(req.params.id).then(function(lesson) {
        console.log(lesson);
        if (!lesson) {
            res.json( { status : 404 , msg : "cant find any lesson" });
        }
        if (lesson) {
            Category.find().sort({_id:-1}).then(function(category) {
                if (category) {
                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: lesson, categories: category, edit: true, Lesson:true });
                }else{
                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: lesson, categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'], edit: true, Lesson:true });
                }
            });
        }
    });
});
router.post('/admin/lesson/:id', function(req, res) {
    Lesson.findByIdAndUpdate(req.params.id,
        {
            subject: req.body.Subject,
            content: req.body.Content,
            pic: req.body.pic,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
            category: req.body.Category,
        },
        function(err,doc) {
            if (err) {
                console.log(err);
                res.render('admin/addLesson', {title: 'Edit Lesson', msg: err});
            } else {
                console.log(doc._id);
                Category.findOne({lesson: doc._id}, function (err,cat){
                    if(err){ console.log(err);}
                    if (cat) {
                        cat.lesson.pull( doc._id );
                        cat.save(function(err, data){
                            if(err){ console.log(err);}
                            if(!err){
                                Category.findOne({category: req.body.Category}, function (err, category) {
                                    if (err) return res.status(500).send(err);
                                    if (!err){
                                        category.lesson.push(doc._id);
                                        category.save(function(err, d){
                                            if(err){ console.log(err);}
                                            if(!err){
                                                Category.find().sort({_id:-1}).then(function(categories) {
                                                    if (categories) {
                                                        res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: categories });
                                                    }else{
                                                        res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'] });
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }else {
                        Category.findOne({category: req.body.Category}, function (err, category) {
                            if (err) return res.status(500).send(err);
                            if (!err){
                                category.lesson.push(doc._id);
                                category.save(function(err, d){
                                    if(err){ console.log(err);}
                                    if(!err){
                                        Category.find().sort({_id:-1}).then(function(categories) {
                                            if (categories) {
                                                res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: categories });
                                            }else{
                                                res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'] });
                                            }
                                        });
                                    }
                                })
                            }
                        });
                    }
                })
            }
        }
    );
});

module.exports = router;