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

router.get('/admin/lesson/:id', function(req, res, next) {

    Lesson.findById(req.params.id).then(function(lesson) {
        console.log(lesson);
        if (!lesson) {
            res.json( { status : 404 , msg : "cant find any lesson" });
        }
        if (lesson) {
            Category.find().sort({_id:-1}).then(function(category) {
                if (category) {
                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: lesson, categories: category });
                }else{
                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: lesson, categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'] });
                }
            });
        }
    });
});
router.post('/admin/lesson/:id', upload.single('file'), function(req, res) {
    Lesson.findByIdAndUpdate(req.params.id,
        {
            subject: req.body.Subject,
            content: req.body.Content,
            pic: '/uploaded-files/' + req.file.filename,
            jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
            category: req.body.Category,
        },
        function(err,doc) {
            if (err) {
                console.log(err);
                res.render('admin/addLesson', {title: 'Edit Lesson', msg: err});
            } else {
                console.log(doc._id);
                Category.findOne({lesson: doc._id}, function (err,cat){
                    cat.lesson.pull( doc._id );
                    cat.save(function(err, data){
                        if(err){ console.log(err);}
                        if(!err){
                            Category.findOne({category: req.body.Category}, function (err, category) {
                                if (err) return res.status(500).send(err);
                                if (!err){
                                    category.lesson.push(doc._id);
                                    category.save(function(err, d){
                                        if(err){ console.log(err);}
                                        if(!err){
                                            Category.find().sort({_id:-1}).then(function(categories) {
                                                if (categories) {
                                                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: categories });
                                                }else{
                                                    res.render('admin/addLesson', { title: 'Edit lesson', lesson: doc, categories: ['هیچ سر دسته ای یافت نشد اضافه کنید'] });
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    });
                })
            }
        }
    );
});

module.exports = router;