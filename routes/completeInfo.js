var express = require('express');
var router = express.Router();
var trueUsername;

var User = require('../model/User');

/* GET users listing. */
router.get( '/dashboard/complete-info',(req, res) => {
    console.log(req.session);
    User.findOne({ username: req.session.user }).then(user=>{
        console.log(user.jDate);
        res.render('panel/complete',{title:'complete info',username: user.username , email: user.email});
    })
});

router.post('/dashboard/complete-info',function(req, res){
    //console.log(req.session.userid + '  =============================');
    User.findByIdAndUpdate( req.session.userid ,
        {
            name : req.body.name,
            family : req.body.family,
            sex : req.body.sex,
            age : req.body.age,
            job : req.body.job,
            edu : req.body.edu,
            marriage : req.body.marriage,
            address : req.body.address,
            status : true,
        },{ new : true },(err, data) =>{
            if (err) {
                console.log(data);
                return res.json({ status : 500, msg : "an error occurred" });
            } else {
                return res.redirect('/dashboard/first-exam');
            }
        });
});

module.exports = router;
