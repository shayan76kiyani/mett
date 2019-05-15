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

var Lesson = require('../../model/Lesson');
var Category = require('../../model/Category');

/* GET users listing. */
router.get('/admin/add-lesson', function(req, res) {
    Category.find().sort({_id:-1}).then(function(category) {
        if (category) {
            res.render('admin/addLesson', { title: 'addLesson', categories: category });
        }else{
            res.render('admin/addLesson', { title: 'addLesson', categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'] });
        }
    });
});

router.post('/admin/add-lesson', upload.single('file'), function( req,res){
    Lesson.create({
        subject: req.body.Subject,
        content: req.body.Content,
        pic: '/uploaded-files/' + req.file.filename,
        jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        category: req.body.Category,
    },function(err,lesson){
        if(err){
            console.log(err);
            res.render('admin/addLesson', { title: 'addLesson' ,msg: err });
        } else {
            Category.findOne({category: req.body.Category}, function (err, category) {
                if (err) return res.status(500).send(err);
                if (!err){
                    category.lesson.push(lesson._id);
                    category.save(function(err, data){
                        if(err){ console.log(err);}
                        if(!err){
                            Category.find().sort({_id:-1}).then(function(category) {
                                if (category) {
                                    res.render('admin/addLesson', { title: 'addLesson', categories: category, msg: "saved" });
                                }else{
                                    res.render('admin/addLesson', { title: 'addLesson', categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'], msg: "saved" });
                                }
                            });
                        }
                    })
                }
            });
        }
    });
});

module.exports = router;
