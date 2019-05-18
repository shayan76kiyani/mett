var express = require('express');
var router = express.Router();

var Practice = require('../model/Practice');
var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/practice', function(req, res) {
    User.findById(req.session.userid,'practice.practices practice.mark complete completePractice speed' , function(err, user){
        let ids = [];
        if(user.complete){
            user.completePractice.mark = 0;
            user.completePractice.practices = [];
            user.completePractice.done = false;
            user.save(function (err) {
            if (err) return handleError(err);
            console.log('the subdocs were removed');
            });
        }else {
            user.practice.practices.forEach(element => {
                ids.push(element.practice);
            });
        }
        Practice.find({ "_id": { "$nin": ids } },'firstPic secondPic options').sort({_id:-1}).then(function(practice) {
            if (!practice) {
                res.json( { status : 404 , msg : "cant find any practice" });
            }
            if (practice) {
                function shuffle(array) {
                    var currentIndex = array.length, temporaryValue, randomIndex;
                  
                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {
                  
                      // Pick a remaining element...
                      randomIndex = Math.floor(Math.random() * currentIndex);
                      currentIndex -= 1;
                  
                      // And swap it with the current element.
                      temporaryValue = array[currentIndex];
                      array[currentIndex] = array[randomIndex];
                      array[randomIndex] = temporaryValue;
                    }
                  
                    return array;
                  }
                res.render('panel/practice', { title: 'practice', Practices: shuffle(practice), mark: user.practice.mark, allTests: practice.length + ids.length, speed: user.speed, practice: true});
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
            User.findById( req.session.userid, 'complete', function(er ,completeCheck) {
                if (er) return res.status(500).send(err);
                if (completeCheck.complete){
                    User.findOne({ "_id": req.session.userid, "completePractice.practices.practice": foundPractice._id }, function(er ,user) {
                        if (er) return res.status(500).send(err);
                        if (user) {
                            let practiceId;
                            console.log("in soal ghablan javab dadeh shode");
                            user.completePractice.practices.forEach(element => {
                                if (element.practice+'' == foundPractice._id+''){
                                    practiceId = element._id;
                                }
                            });
                            if (user.completePractice.practices.id(practiceId).help < 2 && user.completePractice.practices.id(practiceId).true != true){
                                console.log("kamtar az do ta komak dare");
                                if (foundPractice.options.id(req.body.option).option == foundPractice.trueOption){
                                    console.log("pasokh dorost bod :)");
                                    user.completePractice.mark += 1;
                                    user.completePractice.practices.id(practiceId).true = true;
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 200, mark: doc.completePractice.mark });
                                        }
                                    });
                                }
                                else {
                                    console.log("pasokh ghalat bod :(");
                                    user.completePractice.practices.id(practiceId).help += 1;
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 500, practice: foundPractice, mark: doc.completePractice.mark });
                                        }
                                    });
                                }
                            } else if(user.completePractice.practices.id(practiceId).true == true){
                                console.log("javab dorost ro dadeh ghablan");
                                res.status(200).json({status: 400, mark: user.completePractice.mark});
                            } else {
                                console.log("bistar az do ta komak dare");
                                res.status(200).json({status: 600, mark: user.completePractice.mark});
                            }
                        } else {
                            User.findById(req.session.userid, function(er ,user) {
                                if (er) return res.status(500).send(err);
                                if(foundPractice.options.id(req.body.option).option == foundPractice.trueOption){
                                    console.log("soal taze javab dorost");
                                    user.completePractice.practices.push({
                                        practice:foundPractice,
                                        true: true
                                    });
                                    user.completePractice.mark += 1;
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 200, mark: doc.completePractice.mark });
                                        }
                                    });
                                }else{
                                    console.log("soal taze javab ghalat");
                                    user.completePractice.practices.push({
                                        practice:foundPractice,
                                        help:1
                                    });
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 300, mark: doc.completePractice.mark });
                                        }
                                    });
                                }
                            });
                        }
                        
                    });
                }else{
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
                            if (user.practice.practices.id(practiceId).help < 2 && user.practice.practices.id(practiceId).true != true){
                                console.log("kamtar az do ta komak dare");
                                if (foundPractice.options.id(req.body.option).option == foundPractice.trueOption){
                                    console.log("pasokh dorost bod :)");
                                    user.practice.mark += 1;
                                    user.practice.practices.id(practiceId).true = true;
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 200, mark: doc.practice.mark });
                                        }
                                    });
                                }
                                else {
                                    console.log("pasokh ghalat bod :(");
                                    user.practice.practices.id(practiceId).help += 1;
                                    user.save(function (e, doc) {
                                        if (e) return handleError(err);
                                        else {
                                            res.status(200).json( { status : 500, practice: foundPractice, mark: doc.practice.mark });
                                        }
                                    });
                                }
                            } else if(user.practice.practices.id(practiceId).true == true){
                                console.log("javab dorost ro dadeh ghablan");
                                res.status(200).json({status: 400, mark: user.practice.mark});
                            } else {
                                console.log("bistar az do ta komak dare");
                                res.status(200).json({status: 600, mark: user.practice.mark});
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
                                            res.status(200).json( { status : 200, mark: doc.practice.mark });
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
                                            res.status(200).json( { status : 300, mark: doc.practice.mark });
                                        }
                                    });
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
