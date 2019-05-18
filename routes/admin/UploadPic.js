var express = require('express');
var router = express.Router();
const uuidv1 = require('uuid/v1');
var otpGenerator = require('otp-generator');
const path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploaded-files')
    },
    filename: (req, file, cb) => {
        cb(null, otpGenerator.generate(6, {
            upperCase: false,
            specialChars: false
        })+ '-' + uuidv1() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 5242880  //5 MB  5242880
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

router.post('/admin/upload-pic', upload.single('file'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    if (req) {
        if(req.file.filename){
            res.status(200).json( {status:200, msg : "pic saved", file:'/uploaded-files/'+req.file.filename});
        }else{
            res.status(200).json({status:500,msg: "err ecured"});
        }
    } else {
        res.status(404).json({status:404,msg: "details is not send"});
    }
});

module.exports = router;