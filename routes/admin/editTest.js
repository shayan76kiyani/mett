var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Test = require('../../model/Test');

router.get('/admin/test/:id', function(req, res) {

    Test.findById(req.params.id).then(function(test) {
        console.log(test);
        if (!test) {
            res.json( { status : 404 , msg : "cant find any test" });
        }
        if (test) {
            res.render('admin/addTest', { title: 'Edit test', test: test, edit: true, Test:true });
        }
    });
});
router.post('/admin/test/:id', function(req, res) {
    Test.findByIdAndUpdate(req.params.id,
        {
            trueOption: req.body.trueOption,
            pic: req.body.pic,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        },
        function(err,test) {
            if (err) {
                console.log(err);
                res.render('admin/addTest', {title: 'Edit test', msg: err});
            } else {
                res.render('admin/addTest', {title: 'Edit test', msg: "saved", test: test});  
            }
        }
    );
});

module.exports = router;