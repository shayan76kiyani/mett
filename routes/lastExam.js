var express = require('express');
var router = express.Router();

var Test = require('../model/Test');
var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/last-exam', function(req, res) {
    User.findById(req.session.userid,'lastTest.test lastTest.mark firstTest.mark speed complete' , function(err, user){
        let ids = [];
        if(user.complete){
            user.completeLastTest.mark = 0;
            user.completeLastTest.test = [];
            user.completePractice.done = false;
            user.save(function (err) {
            if (err) return handleError(err);
            console.log('the subdocs were removed');
            });
        }else {
            ids = user.lastTest.test;
        }
        Test.find({ "_id": { "$nin": ids } }).sort({_id:-1}).then(function(test) {
            if (!test) {
                res.json( { status : 404 , msg : "cant find any test" });
            }
            if (test) {
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
                res.render('panel/exam', { title: 'Last Exam', Tests: shuffle(test), mark: user.lastTest.mark, allTests: test.length + ids.length, firstTestMark: user.firstTest.mark, speed: user.speed, lastTest: true});
            }
        });
    });
});
router.post('/dashboard/last-exam', function(req, res) {
    console.log(req.body);
    if (req.body.done == 'مرحله بعد'){
        User.findByIdAndUpdate(req.session.userid,{
            'lastTest.done': true,
            'complete': true,
        }, {
            new: true
        }, function (err, user) {
            if (err) return res.status(500).send(err);
            else{
                res.redirect('/dashboard/set-speed');
            }
        });
    }else {
        Test.findOne({ "options._id": req.body.option }, function(err,foundTest) {
            if (err) return res.status(500).send(err);
            User.findById(req.session.userid, function(er ,user) {
                if (er) return res.status(500).send(err);
                if (user.complete) {
                    if(foundTest.options.id(req.body.option).option == foundTest.trueOption){
                        user.completeLastTest.test.push(foundTest);
                        user.completeLastTest.mark += 1;
                        user.save(function (e, doc) {
                            if (e) return handleError(err);
                            else {
                                res.status(200).json( { status : 200, mark: doc.completeLastTest.mark, firstTestMark: doc.firstTest.mark });
                            }
                        });
                    }else{
                        user.completeLastTest.test.push(foundTest);
                        user.save(function (e, doc) {
                            if (e) return handleError(err);
                            else {
                                res.status(200).json( { status : 200, mark: doc.completeLastTest.mark, firstTestMark: doc.firstTest.mark });
                            }
                        });
                    }
                }else {
                    if(foundTest.options.id(req.body.option).option == foundTest.trueOption){
                        user.lastTest.test.push(foundTest);
                        user.lastTest.mark = user.lastTest.mark + 1;
                        user.save(function (e, doc) {
                            if (e) return handleError(err);
                            else {
                                res.status(200).json( { status : 200, mark: doc.lastTest.mark, firstTestMark: doc.firstTest.mark });
                            }
                        });
                    }else{
                        user.lastTest.test.push(foundTest);
                        user.save(function (e, doc) {
                            if (e) return handleError(err);
                            else {
                                res.status(200).json( { status : 200, mark: doc.lastTest.mark, firstTestMark: doc.firstTest.mark });
                            }
                        });
                    }
                }
            });
        });
    }
});

module.exports = router;
