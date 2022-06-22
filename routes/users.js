const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, isAdmin, } = require('../config/auth');

// import models
//User model - make it easier to call methods on the user ofject by using models
const User = require('../models/User.js');
const Userinfo = require('../models/Userinfo');
const Donate = require('../models/Donate');
const Search = require('../models/Search');

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});

//handle registration dat sent from the registration form
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors =[];

    //check fields
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all the fields'});
    }

    // check if password and password2 match
 if (password !== password2) {
    errors.push({msg: 'passwords do not match'});
}

   //check if password lenght meets minimum number of characters
   if(password.length < 6) {
       errors.push({msg: 'password should be at least six characters long'});
   }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else{
        
        //pass validated data into the db
        //first check if user exists in the database
        User.findOne({email : email})
        .then(user => {
            if(user) {
                //user already exists
                errors.push({msg: 'User email is already registered.'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                // create a new user while encrypting the password
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // Hash the password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set password to hashed value
                    newUser.password = hash;

                    //save the user and redirect the user to tthe login page
                    newUser.save()
                    .then( user => {
                        req.flash('success_msg','You are now registered');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }));
            }
        });
    }
});

//login handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/userdashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handler
router.get('/logout',ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

//add user information handler
router.get('/pendingdonations', ensureAuthenticated, isAdmin, (req, res) => {
    Donate.find({donated: false})
    .then(donations => {
        res.render('pendingdonations', {
            donations: donations
        });
    })
    .catch(err => {
        console.log(err);
    });
    
});

router.get('/pendingrequests', ensureAuthenticated, isAdmin, (req, res) => {
    Search.find({received: false})
    .then(requests => {
        res.render('pendingrequests', {
            requests: requests
        });
    })
    .catch(err => {
        console.log(err);
    });
    
});

router.get('/pending/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    Donate.findById(req.params.id, (err, donation) => {
        if(err)
        {
            console.log(err)
            return next(err)
        }
        donation.donated = true;
        donation.save();
        req.flash('success_msg', 'Donated successfully');
        return res.redirect('/users/pendingdonations');
    });
});

router.get('/pendingr/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    Search.findById(req.params.id, (err, request) => {
        if(err)
        {
            console.log(err)
            return next(err)
        }
        request.received = true;
        request.save();
        req.flash('success_msg', 'Received successfully');
        return res.redirect('/users/pendingrequests');
    });
});






router.get('/userdashboard',ensureAuthenticated, (req, res) => {
    Userinfo.findOne({ userID : req.user._id})
    .then( user => {
        if(user) {
            req.flash('success_msg', 'Completed profile view records here');
            res.redirect('/users/records');
        }
        else{
            res.render('userdashboard');
        }
    }).catch(err => console.log(err));
});

router.post('/updateinfo', ensureAuthenticated, (req, res) => {
    const { fullName, bloodGroup, rh, phoneNumber, address, city, id } = req.body;
    const userID = req.user._id;
    let errors = [];

    if( !fullName || !bloodGroup || !rh || !phoneNumber || ! address || !city || !id) {
        errors.push({msg: 'please fill in all the fields'})
    }

    if(errors.length > 0){
        res.render('userdashboard', {
            fullName,
            phoneNumber,
            city,
            id,
            rh,
            bloodGroup,
            address
        });
    } else {
        const newUserinfo = new Userinfo({
            fullName: fullName,
            phoneNumber: phoneNumber,
            city: city,
            id: id,
            rh: rh,
            bloodGroup: bloodGroup,
            address: address,
            userID: userID
        });
        newUserinfo.save()
        .then( userinfo => {
            req.flash('success_msg', 'Information Updated Successfully');
            res.redirect('/users/records');
        })
        .catch(err => {
            console.log(err);
        });
    }

});
router.get('/records',ensureAuthenticated,  (req, res) => {
    Donate.find({donationID : req.user._id})
    .then(donations => {
    res.render('records', {
        donations: donations
    });
    })
    .catch(err => {
        console.log(err);
    });
});

router.get('/requests', ensureAuthenticated, (req, res) => {
    Search.find({requestID : req.user._id})
    .then(requests => {
        res.render('requests', {
            requests: requests
        });
    })
    .catch(err => {
        console.log(err);
    })

});

router.get('/usercard', ensureAuthenticated, isAdmin, (req, res) => {
 Userinfo.find()
    .then(userinfos => {
        res.render('usercard', {
            userinfos: userinfos
        });
    })
    .catch(err => {
        console.log(err);
    });
});

router.get('/donate', ensureAuthenticated, (req, res) => {
    res.render('donate');
});
router.get('/searchdonors', ensureAuthenticated, (req, res) => {
    res.render('searchdonors');
});

router.get('/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        user.userType = true;
        user.save();
        return res.redirect('/dashboard');
    });
});
router.get('/reverse/:id', ensureAuthenticated, isAdmin, (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            console.log(err);
            return next(err);
        }
        user.userType = false;
        user.save();
        return res.redirect('/dashboard');
    });
});
 


module.exports = router;