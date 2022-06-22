const router = require('express').Router();
const Donate = require('../models/Donate');
const Search = require('../models/Search');

const { ensureAuthenticated } = require('../config/auth');


router.post('/donate', ensureAuthenticated, (req, res) => {

    const { fullName, phoneNumber, location, bloodGroup } = req.body;
    const donationID = req.user._id;
    let errors =[];

    if( !fullName || !phoneNumber || !location || !bloodGroup) {
        errors.push({msg: 'please fill in all the fields'});
    }

    if(errors.length > 0) {
        res.render('donate', {
            fullName,
            phoneNumber,
            location,
            bloodGroup,
            errors
        });
    } else {
        const newDonate = new Donate({
            fullName,
            phoneNumber,
            location,
            bloodGroup,
            donationID
        });
        newDonate.save()
        .then(donate => {
            req.flash('success_msg', 'Received, Thank You')
            res.redirect('/users/records');
        })
        .catch(err => {
            console.log(err);
        });
        
    }

});

router.post('/searchdonors', ensureAuthenticated, (req, res) => {

    const { fullName, phoneNumber, location, bloodGroup } = req.body;
    const requestID = req.user._id;
    let errors =[];

    if( !fullName || !phoneNumber || !location || !bloodGroup) {
        errors.push({msg: 'please fill in all the fields'});
    }

    if(errors.length > 0) {
        res.render('donate', {
            fullName,
            phoneNumber,
            location,
            bloodGroup,
            errors
        });
    } else {
        const newSearch = new Search({
            fullName,
            phoneNumber,
            location,
            bloodGroup,
            requestID
        });
        newSearch.save()
        .then(search => {
            req.flash('success_msg', 'Requested, Be in touch')
            res.redirect('/users/records');
        })
        .catch(err => {
            console.log(err);
        });
        
    }

});

module.exports = router;
