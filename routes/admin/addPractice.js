var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var Practice = require('../../model/Practice');

/* GET users listing. */
router.get('/admin/add-practice', function(req, res) {
    res.render('admin/addPractice', { title: 'add practice', practice:true });
});

router.post('/admin/add-practice', function( req,res){
    Practice.create({
        trueOption: req.body.trueOption,
        firstPic: req.body.firstPic,
        secondPic: req.body.secondPic,
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
    },function(err,practice){
        if(err){
            console.log(err);
            res.render('admin/addPractice', { title: 'add practice' ,msg: err });
        } else {
            res.render('admin/addPractice', { title: 'add practice' ,msg: "saved", practice: practice });     
        }
    });
});

module.exports = router;
