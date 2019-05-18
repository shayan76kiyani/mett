var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    speed:{type:Number, default:200},
    username: {type: String, unique: true, require: true},
    email: {type: String, unique: true, require: true},
    password: {type: String, require: true},
    status: {type: Boolean, default: false},
    complete: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    name: {type: String},
    family: {type: String},
    sex: {type: String },
    age: {type: Number },
    edu: {type: String},
    job: {type: String, unique: true,require: true},
    marriage: {type: Boolean},
    address: {type: String},
    firstTest: {
        mark: {type: Number, default: 0},
        test:[{type: mongoose.Schema.Types.ObjectId, ref: 'Test'}],
        done:{type: Boolean, default: false}
    },
    lastTest: {
        mark: {type: Number, default: 0},
        test:[{type: mongoose.Schema.Types.ObjectId, ref: 'Test'}],
        done:{type: Boolean, default: false}
    },
    completeLastTest: {
        mark: {type: Number, default: 0},
        test:[{type: mongoose.Schema.Types.ObjectId, ref: 'Test'}],
        done:{type: Boolean, default: false}
    },
    practice: {
        mark: {type: Number, default: 0},
        practices:[
            {
                practice: {type: mongoose.Schema.Types.ObjectId, ref: 'Practice'},
                help:{type: Number, default: 0},
                true:{type:Boolean, default: false}
            }
        ],
        done:{type: Boolean, default: false}
    },
    completePractice: {
        mark: {type: Number, default: 0},
        practices:[
            {
                practice: {type: mongoose.Schema.Types.ObjectId, ref: 'Practice'},
                help:{type: Number, default: 0},
                true:{type:Boolean, default: false}
            }
        ],
        done:{type: Boolean, default: false}
    },
    lessonStatus: {type: Boolean, default: false },
    lessonsRead: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    jDate:{type:Date, require:true},
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
var User = mongoose.model('User', UserSchema);
module.exports = User;
