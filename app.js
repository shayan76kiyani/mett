var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var geoip = require('geoip-lite');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var assert = require('assert');
let middleware = require('./middleware');

var app = express();

var indexRouter = require('./routes/index');
var resetRouter = require('./routes/reset');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var completeInfoRouter = require('./routes/completeInfo');
var firstExamRouter = require('./routes/firstExam');
var lessonRouter = require('./routes/lesson');
var practiceRouter = require('./routes/practice');
var lastExamRouter = require('./routes/lastExam');
//admin routes
var adminLoginRouter = require('./routes/admin/adminLogin');
var adminDashboardRouter = require('./routes/admin/adminDashboard');

var usersRouter = require('./routes/admin/users');
var editUserRouter = require('./routes/admin/editUser');

var addLessonRouter = require('./routes/admin/addLesson');
var lessonsRouter = require('./routes/admin/lessons');
var editLessonRouter = require('./routes/admin/editLesson');

var addCategoryRouter = require('./routes/admin/addCategory');
var categoriesRouter = require('./routes/admin/categories');
var editCategoryRouter = require('./routes/admin/editCategory');

var addTestRouter = require('./routes/admin/addTest');
var testsRouter = require('./routes/admin/tests');
var editTestRouter = require('./routes/admin/editTest');

var addPracticeRouter = require('./routes/admin/addPractice');
var practicesRouter = require('./routes/admin/practices');
var editPracticeRouter = require('./routes/admin/editPractice');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**###################################################
 *     			 Create Database
 *  using MongoDB with Blog name and collections are
 * 			 1-register & 2.mySessions
 *   			December 22 2018
 ######################################################*/

mongoose.connect('mongodb://localhost/Sina_db', { useNewUrlParser: true }); //create Blog DB

// check DB connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("@!--we're connected to DB--!@");
});

//to store sessions in mySessions collection
var store = new MongoDBStore({
  uri: 'mongodb://localhost/Sina_db',
  collection: 'mySessions'
});

//store error handeling
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
    session({
      key: 'user_sid',
      secret: 's@aggest@n',
      resave: true,
      saveUninitialized: false,
      cookie: {
        expires: 6000000
      },
      store: store
    })
);
// session

/**####################################
 *         register and login
 *  using session and cookies to login
 *         December 22 2018
 #######################################*/

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (!req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

app.use('/', indexRouter);

app.all('/reset', resetRouter);
app.all('/signup',middleware.loginChecker, signupRouter);
app.all('/login',middleware.loginChecker, loginRouter);

app.all('/dashboard/complete-info',middleware.completeChecker, completeInfoRouter);

app.all('/dashboard/first-exam',middleware.firstExamChecker, firstExamRouter);
app.all('/dashboard/lesson',middleware.lessonChecker, lessonRouter);
app.all('/dashboard/practice',middleware.practiceChecker, practiceRouter);
app.all('/dashboard/last-exam',middleware.lastExamChecker, lastExamRouter);

app.all('/dashboard',middleware.dashboardChecker, dashboardRouter);
//admin routes
app.all('/admin/login',middleware.adminSessionChecker, adminLoginRouter);
app.all('/admin/dashboard',middleware.adminChecker, adminDashboardRouter);

app.all('/admin/users',middleware.adminChecker, usersRouter);
app.all('/admin/user/:id',middleware.adminChecker, editUserRouter);

app.all('/admin/add-lesson',middleware.adminChecker, addLessonRouter);
app.all('/admin/lessons',middleware.adminChecker, lessonsRouter);
app.all('/admin/lesson/:id',middleware.adminChecker, editLessonRouter);

app.all('/admin/add-category',middleware.adminChecker, addCategoryRouter);
app.all('/admin/categories',middleware.adminChecker, categoriesRouter);
app.all('/admin/category/:id',middleware.adminChecker, editCategoryRouter);

app.all('/admin/add-test',middleware.adminChecker, addTestRouter);
app.all('/admin/tests',middleware.adminChecker, testsRouter);
app.all('/admin/test/:id',middleware.adminChecker, editTestRouter);

app.all('/admin/add-practice',middleware.adminChecker, addPracticeRouter);
app.all('/admin/practices',middleware.adminChecker, practicesRouter);
app.all('/admin/practice/:id',middleware.adminChecker, editPracticeRouter);
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
