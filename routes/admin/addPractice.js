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

/* GET users listing. */
router.get('/admin/add-practice', function(req, res) {
    res.render('admin/addPractice', { title: 'add practice' });
});

router.post('/admin/add-practice', upload.single('file'), function( req,res){
    Practice.create({
        trueOption: req.body.trueOption,
        content: req.body.Content,
        pic: '/uploaded-files/' + req.file.filename,
        jDate: jdate.JDate().toString('yyyy/MM/dd HH:mm:ss'),
        options:[
            {
                option: 'خشم',
            },{
                option: 'تمسخر',
            },{
                option: 'انزجار',
            },{
                option: 'ترس',
            },{
                option: 'شادی',
            },{
                option: 'غم',
            },{
                option: 'تعجب',
            }
        ],
    },function(err,practice){
        if(err){
            console.log(err);
            res.render('admin/addPractice', { title: 'add practice' ,msg: err });
        } else {
            res.render('admin/addPractice', { title: 'add practice' ,msg: "saved", practice: practice });     
        }
    });
});

module.exports = router;
