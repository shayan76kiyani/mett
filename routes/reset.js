var express = require('express');
var router = express.Router();

/* GET reset page. */
router.get('/', function(req, res, next) {
    res.render('reset', { title: 'password reset' });
});

module.exports = router;