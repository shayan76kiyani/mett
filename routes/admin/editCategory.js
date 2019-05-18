var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Category = require('../../model/Category');

router.get('/admin/category/:id', function(req, res, next) {

    Category.findById(req.params.id).then(function(category) {
        console.log(category);
        if (!category) {
            res.json( { status : 404 , msg : "cant find any category" });
        }
        if (category) {
            res.render('admin/addCategory', { title: 'Edit category', category: category, edit: true, Category:true });
        }
    });
});
router.post('/admin/category/:id', function(req, res) {
    Category.findByIdAndUpdate(req.params.id,
        {
            category: req.body.category,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        },
        function(err,doc) {
            if (err) {
                console.log(err);
                res.render('admin/addCategory', {title: 'Edit Category', msg: err});
            } else {
                res.render('admin/addCategory', {title: 'Edit Category', msg: "saved", category: doc});
            }
        }
    );
});

module.exports = router;