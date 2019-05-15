var express = require('express');
var router = express.Router();
var jdate = require('jdate');
const multer = require('multer');
const path   = require('path');

/** Storage Engine */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploaded-files')
    },
    filename: function(req, file, cb){
        cb(null,  new Date().getTime().toString()+path.extname(file.originalname));
    }
});
//init
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 200000
    },
    fileFilter: function (req, file, callback) {
        validateFile(file, callback);
    }
});

var validateFile = function (file, cb) {
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extension && mimeType) {
        return cb(null, true);
    } else {
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}

var Test = require('../../model/Test');

router.get('/admin/test/:id', function(req, res) {

    Test.findById(req.params.id).then(function(test) {
        console.log(test);
        if (!test) {
            res.json( { status : 404 , msg : "cant find any test" });
        }
        if (test) {
            res.render('admin/addTest', { title: 'Edit test', test: test });
        }
    });
});
router.post('/admin/test/:id', upload.single('file'), function(req, res) {
    Test.findByIdAndUpdate(req.params.id,
        {
            trueOption: req.body.trueOption,
            pic: '/uploaded-files/' + req.file.filename,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        },
        function(err,test) {
            if (err) {
                console.log(err);
                res.render('admin/addTest', {title: 'Edit test', msg: err});
            } else {
                res.render('admin/addTest', {title: 'Edit test', msg: "saved", test: test});  
            }
        }
    );
});

module.exports = router;