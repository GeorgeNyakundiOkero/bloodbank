const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated, isAdmin } = require('../config/auth.js');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/faq', (req, res) => {
    res.render('faq');
});



router.get('/dashboard', ensureAuthenticated, isAdmin, (req, res) => {
    User.find()
    .then(users => {
        res.render('dashboard', {
            users: users
        });
    })
    .catch(err => {
        console.log(err)
    });
});
module.exports = router;