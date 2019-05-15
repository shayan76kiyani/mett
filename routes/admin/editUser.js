var express = require('express');
var router = express.Router();
var jdate = require('jdate');

var User = require('../../model/User');

router.get('/admin/user/:email', function (req, res) {

    User.findOne({email: req.params.email}).then(function (user) {
        console.log(user);
        if (!user) {
            res.json({status: 404, msg: "cant find any user"});
        }
        if (user) {
            res.render('admin/editUser', {title: 'Edit user', user: user});
        }
    });
});
router.post('/admin/user/:email', function (req, res) {
    User.findOneAndUpdate({email: req.params.email},
        {
            name: req.body.name,
            family: req.body.family,
            sex: req.body.sex,
            age: req.body.age,
            job: req.body.job,
            edu: req.body.edu,
            marriage: req.body.marriage,
            address: req.body.address,
            status: req.body.status,
        }, {new: true}, (err, user) => {
            if (err) {
                console.log(err);
                res.render('admin/editUser', {title: 'Edit test', msg: err});
            } else {
                console.log(user);
                res.render('admin/editUser', {title: 'Edit test', msg: "saved", user: user});

            }
        }
    );
});

module.exports = router;