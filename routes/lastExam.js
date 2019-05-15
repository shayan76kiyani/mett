var express = require('express');
var router = express.Router();

var Test = require('../model/Test');

/* GET users listing. */
router.get('/dashboard/last-exam', function(req, res) {
    Test.find().sort({_id:-1}).then(function(test) {
        console.log(test);
        if (!test) {
            res.json( { status : 404 , msg : "cant find any test" });
        }
        if (test) {
            res.render('panel/exam', { title: 'Last Exam', Tests: test });
        }
    });
});

module.exports = router;
