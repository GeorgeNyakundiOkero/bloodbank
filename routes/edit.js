
const router = require('express').Router();
const { ensureAuthenticated, isAdmin } = require('../config/auth');
const Userinfo = require('../models/Userinfo');

router.get('/:id',ensureAuthenticated, isAdmin, (req, res) => {
    Userinfo.findOne({_id: req.params.id})
    .then(userinfo => {
        res.render('edit', {
            userinfo
        });
    })
    .catch(err => {
        console.log(err);
    });
});

router.post('/user/:id', ensureAuthenticated, isAdmin, (req, res) => {
    Userinfo.findByIdAndUpdate({_id : req.params.id}, req.body)
    .then(updated => {
        console.log(updated);
        req.flash('success_msg', 'Record Updated Successfully');
        res.redirect('/users/usercard');
    })
    .catch(err => {
        console.log(err);
    });
    
    
});

module.exports = router;