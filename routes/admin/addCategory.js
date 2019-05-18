var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Category = require('../../model/Category');

/* GET users listing. */
router.get('/admin/add-category', function(req, res) {
    res.render('admin/addCategory', { title: 'addCategory', category:true});
});

router.post('/admin/add-category', function( req,res){
    console.log(req.body);
    Category.create({
        category: req.body.category,
        jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
    },function(err,category){
        console.log(category);
        if(err){
            console.log(err);
            res.render('admin/addCategory', { title: 'addCategory' ,msg: err });
        } else {
            res.render('admin/addCategory', { title: 'addCategory' ,msg: "saved" });
        }
    });
});

module.exports = router;
