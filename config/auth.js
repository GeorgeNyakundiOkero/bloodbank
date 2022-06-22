module.exports = {
    ensureAuthenticated: function(req, res, next) {
            if(req.isAuthenticated()) {
                return next();
            }
            req.flash('error_msg', 'please log in to view this resource');
            res.redirect('/users/login');
    },
    isAdmin: function(req, res, next) {
        if(req.user.userType) {
            return next();
            
        }
        req.flash('error_msg', 'You are not authorized to view this resource');
        res.redirect('/users/records');
    },
    

}