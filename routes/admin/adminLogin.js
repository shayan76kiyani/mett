var express = require('express');
var router = express.Router();
var trueUsername;

var User = require('../../model/User');

/* GET users listing. */
router.get('/admin/login', function(req, res, next) {
    res.render('admin/login', { title: 'login' });
});

router.post('/admin/login',(req, res) => {
    var username = req.body.username,
        password = req.body.password;

    User.findOne({ username: username }).then(function(user) {
        if (!user) {
            res.redirect('/login');
        }
        if (user) {
            trueUsername = req.body.username;
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {throw err;}
            if (isMatch) {
                req.session.user = user.username;
                res.redirect('/dashboard');
            }
            else {
                res.redirect('/login');
            }
        });
    });
});

module.exports = router;
