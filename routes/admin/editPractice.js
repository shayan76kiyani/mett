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

var Practice = require('../../model/Practice');

router.get('/admin/practice/:id', function(req, res) {

    Practice.findById(req.params.id).then(function(practice) {
        console.log(practice);
        if (!practice) {
            res.json( { status : 404 , msg : "cant find any practice" });
        }
        if (practice) {
            res.render('admin/addPractice', { title: 'Edit Practice', practice: practice });
        }
    });
});
router.post('/admin/practice/:id', upload.single('file'), function(req, res) {
    var option = req.body.options.split(",");
    Practice.findByIdAndUpdate(req.params.id,
        {
            content: req.body.Content,
            pic: '/uploaded-files/' + req.file.filename,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
            options: {
                option: "",
            },
        },
        function(err,practice) {
            if (err) {
                console.log(err);
                res.render('admin/addPractice', {title: 'Edit Practice', msg: err});
            } else {
                option.forEach(function (opt) {
                    console.log(opt);
                    practice.options.push({option: opt});
                });
                practice.save(function(err, data){
                    if(err){ console.log(err);}
                    if(!err){
                        console.log(data);
                        res.render('admin/addPractice', {title: 'Edit Practice', msg: "saved", practice: data});
                    }
                });
            }
        }
    );
});

module.exports = router;