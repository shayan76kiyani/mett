var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Practice = require('../../model/Practice');

router.get('/admin/practice/:id', function(req, res) {

    Practice.findById(req.params.id).then(function(practice) {
        console.log(practice);
        if (!practice) {
            res.json( { status : 404 , msg : "cant find any practice" });
        }
        if (practice) {
            res.render('admin/addPractice', { title: 'Edit Practice', practice: practice, edit: true, practice:true });
        }
    });
});
router.post('/admin/practice/:id', function(req, res) {
    Practice.findByIdAndUpdate(req.params.id,
        {
            trueOption: req.body.trueOption,
            firstPic: req.body.firstPic,
            secondPic: req.body.secondPic,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss')
        },
        function(err,practice) {
            if (err) {
                console.log(err);
                res.render('admin/addPractice', {title: 'Edit Practice', msg: err});
            } else {
                res.render('admin/addPractice', {title: 'Edit Practice', msg: "saved", practice: practice}); 
            }
        }
    );
});

module.exports = router;