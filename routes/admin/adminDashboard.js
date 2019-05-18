var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin/dashboard', function(req, res, next) {
    res.render('admin/index', { title: 'admin panel', dashboard:true });
});

module.exports = router;
