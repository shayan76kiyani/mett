// ###################### Calling model ##########################
let User = require('./model/User');
// middleware function to check for logged-in users
let loginChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
    } else {
      next();
    }
};
let completeChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                res.redirect('/dashboard');
            }else{
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};
let firstExamChecker = (req, res, next) =>{
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                if (user.firstTest.done){
                    res.redirect('/dashboard/lesson');
                }
                else {
                    next();
                }
            }else{
                res.redirect('/dashboard/complete-info');
            }
        });

    } else {
        res.redirect('/login');
    }
}
let lessonChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                if (user.firstTest.done){
                    if (user.lessonStatus == true && user.complete == false){
                        res.redirect('/dashboard/practice');
                    }
                    else{
                        next();
                    }
                }
                else {
                    res.redirect('/dashboard/first-exam');
                }
            }else{
                res.redirect('/dashboard/complete-info');
            }
        });

    } else {
        res.redirect('/login');
    }
};
let practiceChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                if (user.firstTest.done){
                    if (user.lessonStatus){
                        if (user.practice.done == true && user.complete == false){
                            res.redirect('/dashboard/last-exam');
                        }
                        else{
                            next();
                        }
                    }
                    else{
                        res.redirect('/dashboard/lesson');
                    }
                }
                else {
                    res.redirect('/dashboard/first-exam');
                }
            }else{
                res.redirect('/dashboard/complete-info');
            }
        });

    } else {
        res.redirect('/login');
    }
};
let lastExamChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                if (user.firstTest.done){
                    if (user.lessonStatus){
                        if (user.practice.done){
                            if (user.lastTest.done && user.complete == true){
                                res.redirect('/dashboard');
                            }
                            else{
                                next();
                            }
                        }
                        else{
                            res.redirect('/dashboard/practice');
                        }
                    }
                    else{
                        res.redirect('/dashboard/lesson');
                    }
                }
                else {
                    res.redirect('/dashboard/first-exam');
                }
            }else{
                res.redirect('/dashboard/complete-info');
            }
        });

    } else {
        res.redirect('/login');
    }
};
let dashboardChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        User.findOne({ username: req.session.user }).then(function(user) {
            if(user.status){
                if(user.complete){
                    next();
                }else{
                    res.redirect('/dashboard/first-exam');
                }
            }else{
                res.redirect('/dashboard/complete-info');
            }
        });
    } else {
        res.redirect('/login');
    }
};
  let adminSessionChecker = (req, res, next) => {
      if (req.session.user && req.cookies.user_sid) {
          console.log('login');
          User.findOne({ username: req.session.user }).then(function(user) {
              if(user.admin){
                  res.redirect('/admin/dashboard');
              }else{
                  res.redirect('/dashboard');
              }
          });
  
      } else {
          next();
      }
  };
  let adminChecker = (req, res, next) => {
      if (req.session.user && req.cookies.user_sid) {
          User.findOne({ username: req.session.user }).then(function(user) {
              if(user.admin){
                  next();
              }else{
                  res.redirect('/admin/login');
              }
          });
  
      } else {
          res.redirect('/admin/login');
      }
  };

  module.exports = {
    loginChecker: loginChecker,
    completeChecker: completeChecker,
    firstExamChecker: firstExamChecker,
    lessonChecker: lessonChecker,
    practiceChecker: practiceChecker,
    lastExamChecker: lastExamChecker,
    dashboardChecker: dashboardChecker,
    adminSessionChecker: adminSessionChecker,
    adminChecker: adminChecker
  };