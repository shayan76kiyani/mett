var express = require('express');
var router = express.Router();

var Test = require('../model/Test');
var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/first-exam', function(req, res) {
    User.findById(req.session.userid,'firstTest.test' , function(err, user){
        Test.find({ "_id": { "$nin": user.firstTest.test } }).sort({_id:-1}).then(function(test) {
            console.log(test);
            if (!test) {
                res.json( { status : 404 , msg : "cant find any test" });
            }
            if (test) {
                res.render('panel/exam', { title: 'First Exam', Tests: test });
            }
        });
    });
});
router.post('/dashboard/first-exam', function(req, res) {
    console.log(req.body);
    if (req.body.done == 'مرحله بعد'){
        User.findByIdAndUpdate(req.session.userid,{
            'firstTest.done': true
        }, {
            new: true
        }, function (err, user) {
            if (err) return res.status(500).send(err);
            else{
                res.redirect('/dashboard/lesson');
            }
        });
    }else {
        Test.findOne({ "options._id": req.body.option }, function(err,foundTest) {
            if (err) return res.status(500).send(err);
            User.findById(req.session.userid, function(er ,user) {
                if (er) return res.status(500).send(err);
                if(foundTest.options.id(req.body.option).option == foundTest.trueOption){
                    user.firstTest.test.push(foundTest);
                    user.firstTest.mark = user.firstTest.mark + 1;
                    user.save(function (e, doc) {
                        if (e) return handleError(err);
                        else {
                            res.status(200).json( { status : 200 });
                        }
                    });
                }else{
                    user.firstTest.test.push(foundTest);
                    user.save(function (e, doc) {
                        if (e) return handleError(err);
                        else {
                            res.status(200).json( { status : 200 });
                        }
                    });
                }
            });
        });
    }
});

module.exports = router;
