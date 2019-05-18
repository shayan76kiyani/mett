var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
    res.render('panel/index', { title: 'panel', dasboard: true });
});

module.exports = router;
