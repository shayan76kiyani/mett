var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var User = require('../model/User');

/* GET users listing. */
router.get('/signup', function (req, res, next) {
    res.render('signup', {title: 'signup'});
});

router.post('/signup', function (req, res) {
    if (req.body.password == req.body.password_confirmation) {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        })
            .then((user) => {
                req.session.user = user.username;
                req.session.userid = user._id;

                res.redirect('/dashboard/complete-info');
            })
            .catch((error) => {
                res.redirect('/signup');
            });
        console.log(req.body);
    } else {
        res.redirect('/signup');
    }
});

module.exports = router;
