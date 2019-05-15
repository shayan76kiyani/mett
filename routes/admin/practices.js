var express = require('express');
var router = express.Router();

var Practice = require('../../model/Practice');

/* GET users listing. */
router.get('/admin/practices', function(req, res) {
    Practice.find().sort({_id:-1}).then(function(test) {
        console.log(test);
        if (!test) {
            res.json( { status : 404 , msg : "cant find any practices" });
        }
        if (test) {
            res.render('admin/practice', { title: 'Practices', Tests: test });
        }
    });
});
router.post('/admin/practices',function(req, res){
    console.log(req.body );
    Practice.findByIdAndRemove(req.body.id, (err, lesson) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Practice successfully deleted",
            id: lesson._id
        };
        return res.status(200).send(response);
    });
});

module.exports = router;
