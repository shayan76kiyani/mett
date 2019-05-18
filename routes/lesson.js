var express = require('express');
var router = express.Router();

var Category = require('../model/Category');
var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/lesson', function(req, res) {
    User.findById(req.session.userid,'lessonsRead complete' , function(err, user){
        if (err) return res.status(500).send(err);
        let ids = [];
        if(user.complete != true){
            ids = user.lessonsRead;
        }
        
        Category.find({ "_id": { "$nin": ids } }).populate({ path:"lesson", model: 'Lesson',options: { sort: {'created_at':-1}} }).sort({_id:-1}).then(function(category) {
            console.log(category);
            if (!category) {
                res.json( { status : 404 , msg : "cant find any lesson" });
            }
            if (category) {
                res.render('panel/lesson', { title: 'Lessons', Categories: category, lesson: true });
            }
        });
    });
});
router.post('/dashboard/lesson', function(req, res) {
    if (req.body.done == 'مرحله بعد'){
        User.findByIdAndUpdate(req.session.userid,{
            lessonStatus: true
        }, {
            new: true
        }, function (err, user) {
            if (err) return res.status(500).send(err);
            else{
                res.redirect('/dashboard/practice');
            }
        });
    }else {
        Category.findById(req.body.category, function(err,foundCategory) {
            if (err) return res.status(500).send(err);
            User.findById(req.session.userid).then(function(user) {
                if (user) {
                    if (user.complete){
                        res.status(200).json( { status : 200 });
                    }else{
                        user.lessonsRead.push(foundCategory);
                        user.save(function (e, doc) {
                            if (e) return handleError(err);
                            else {
                                res.status(200).json( { status : 200 });
                            }
                        });
                    }
                }
            });
        });
    }
});

module.exports = router;
