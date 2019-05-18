var express = require('express');
var router = express.Router();

var User = require('../model/User');

/* GET users listing. */
router.get('/dashboard/set-speed', function(req, res) {
    User.findById(req.session.userid,'speed' , function(err, user){
        
        res.render('panel/speed', { title: 'Set Speed', speed: user.speed, setSpeed: true });
            
    });
});
router.post('/dashboard/set-speed', function(req, res) {
    console.log(req.body.speed);
    User.findByIdAndUpdate(req.session.userid,{
        speed : req.body.speed
    } ,{
        new: true
    }, function(err, user){
        if (err) return res.status(500).send(err);
        if(user){
            res.render('panel/speed', { title: 'Set Speed', speed: user.speed });
        }
        
            
    });
});

module.exports = router;
