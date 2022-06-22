const router = require('express').Router();
const Donate = require('../models/Donate');
const Search = require('../models/Search');
const User = require('../models/User');
const Userinfo = require('../models/Userinfo');

const { ensureAuthenticated, isAdmin } = require('../config/auth');

router.get('/donors', ensureAuthenticated, isAdmin, (req, res) => {
    Donate.find({ donated: true})
    .then(donations => {
        res.render('archiveddon', {
            donations: donations
        });
    })
    .catch(err => {
        console.log(err);
    });

});

router.get('/recipients', ensureAuthenticated, isAdmin, (req, res) => {
   Search.find({ received: true})
   .then(requests => {
       res.render('archivedrec', {
           requests: requests
       });
   })
   .catch(err => {
       if(err) {
           console,log(err);
       }
   });
});
module.exports = router;