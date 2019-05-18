var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Test = require('../../model/Test');

/* GET users listing. */
router.get('/admin/add-test', function(req, res) {
    res.render('admin/addTest', { title: 'add test', Test:true });
});

router.post('/admin/add-test', function( req,res){
    Test.create({
        trueOption: req.body.trueOption,
        pic: req.body.pic,
        jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        options:[
            {
                option: 'خشم',
            },{
                option: 'تمسخر',
            },{
                option: 'انزجار',
            },{
                option: 'ترس',
            },{
                option: 'شادی',
            },{
                option: 'غم',
            },{
                option: 'تعجب',
            }
        ],
    },function(err,test){
        console.log(test);
        if(err){
            console.log(err);
            res.render('admin/addTest', { title: 'add test' ,msg: err });
        } else {
            res.render('admin/addTest', { title: 'add test' ,msg: "saved" , test: test});
        }
    });
});

module.exports = router;
