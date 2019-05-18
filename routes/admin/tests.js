var express = require('express');
var router = express.Router();

var Test = require('../../model/Test');

/* GET users listing. */
router.get('/admin/tests', function(req, res) {
    Test.find().sort({_id:-1}).then(function(test) {
        console.log(test);
        if (!test) {
            res.json( { status : 404 , msg : "cant find any test" });
        }
        if (test) {
            res.render('admin/test', { title: 'Tests', Tests: test, Test:true });
        }
    });
});
router.post('/admin/tests',function(req, res){
    console.log(req.body );
    Test.findByIdAndRemove(req.body.id, (err, lesson) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Test successfully deleted",
            id: lesson._id
        };
        return res.status(200).send(response);
    });
});

module.exports = router;
