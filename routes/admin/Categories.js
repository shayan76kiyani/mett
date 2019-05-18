var express = require('express');
var router = express.Router();

var Category = require('../../model/Category');

/* GET users listing. */
router.get('/admin/Categories', function(req, res) {
    Category.find().populate({ path:"lesson", model: 'Lesson' }).sort({_id:-1}).then(function(category) {
        console.log(category);
        if (!category) {
            res.json( { status : 404 , msg : "cant find any category" });
        }
        if (category) {
            res.render('admin/category', { title: 'Categorys', Categories: category, category:true });
        }
    });
});
router.post('/admin/Categories',function(req, res){
    console.log(req.body );
    Category.findByIdAndRemove(req.body.id, (err, category) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Category successfully deleted",
            id: category._id
        };
        return res.status(200).send(response);
    });
});

module.exports = router;
