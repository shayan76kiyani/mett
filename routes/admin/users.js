var express = require('express');
var router = express.Router();

var User = require('../../model/User');

/* GET users listing. */
router.get('/admin/users', function(req, res) {
    User.find().sort({_id:-1}).then(function(user) {
        console.log(user);
        if (!user) {
            res.json( { status : 404 , msg : "cant find any user" });
        }
        if (user) {
            res.render('admin/user', { title: 'Users', Users: user });
        }
    });
});
router.post('/admin/users',function(req, res){
    console.log(req.body );
    User.findOneAndRemove({email:req.body.email}, (err, user) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "User successfully deleted",
            id: user._id
        };
        return res.status(200).send(response);
    });
});

module.exports = router;
