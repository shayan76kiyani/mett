var express = require('express');
var router = express.Router();

var Practice = require('../model/Practice');
var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/practice', function(req, res) {
    User.findById(req.session.userid,'practice.practices' , function(err, user){
        let practice = [];
        user.practice.practices.forEach(element => {
            practice.push(element.practice);
        });
        Practice.find({ "_id": { "$nin": practice } },'pic options').sort({_id:-1}).then(function(practice) {
            if (!practice) {
                res.json( { status : 404 , msg : "cant find any practice" });
            }
            if (practice) {
                res.render('panel/practice', { title: 'practice', Practices: practice });
            }
        });
    });
});
router.post('/dashboard/practice', function(req, res) {
    if (req.body.done == 'مرحله بعد'){
        User.findByIdAndUpdate(req.session.userid,{
            'practice.done': true
        }, {
            new: true
        }, function (err, user) {
            if (err) return res.status(500).send(err);
            else{
                res.redirect('/dashboard/last-exam');
            }
        });
    }else {
        Practice.findOne({ "options._id": req.body.option }, function(err,foundPractice) {
            if (err) return res.status(500).send(err);
            User.findOne({ "_id": req.session.userid, "practice.practices.practice": foundPractice._id }, function(er ,user) {
                if (er) return res.status(500).send(err);
                if (user) {
                    let practiceId;
                    console.log("in soal ghablan javab dadeh shode");
                    user.practice.practices.forEach(element => {
                        if (element.practice+'' == foundPractice._id+''){
                            console.log(element);
                            practiceId = element._id;
                        }
                    });
                    if (user.practice.practices.id(practiceId).help <= 2 && user.practice.practices.id(practiceId).true != true){
                        console.log("kamtar az do ta komak dare");
                        if (foundPractice.options.id(req.body.option).option == foundPractice.trueOption){
                            console.log("pasokh dorost bod :)");
                            user.practice.mark += 1;
                            user.practice.practices.id(practiceId).true = true;
                            user.save(function (e, doc) {
                                if (e) return handleError(err);
                                else {
                                    res.status(200).json( { status : 200 });
                                }
                            });
                        }
                        else {
                            console.log("pasokh ghalat bod :(");
                            user.practice.practices.id(practiceId).help += 1;
                            user.save(function (e, doc) {
                                if (e) return handleError(err);
                                else {
                                    res.status(200).json( { status : 300 });
                                }
                            });
                        }
                    } else if(user.practice.practices.id(practiceId).true == true){
                        console.log("javab dorost ro dadeh");
                        res.status(200).json({status: 400});
                    } else {
                        console.log("bistar az do ta komak dare");
                        res.status(200).json({status: 500});
                    }
                } else {
                    User.findById(req.session.userid, function(er ,user) {
                        if (er) return res.status(500).send(err);
                        if(foundPractice.options.id(req.body.option).option == foundPractice.trueOption){
                            console.log("soal taze javab dorost");
                            user.practice.practices.push({
                                practice:foundPractice,
                                true: true
                            });
                            user.practice.mark += 1;
                            user.save(function (e, doc) {
                                if (e) return handleError(err);
                                else {
                                    res.status(200).json( { status : 200 });
                                }
                            });
                        }else{
                            console.log("soal taze javab ghalat");
                            user.practice.practices.push({
                                practice:foundPractice,
                                help:1
                            });
                            user.save(function (e, doc) {
                                if (e) return handleError(err);
                                else {
                                    res.status(200).json( { status : 300 });
                                }
                            });
                        }
                    });
                }
                
            });
        });
    }
});

module.exports = router;
