module.exports = (req, res, next) => {
    if(!req.session.user.admin){
        req.flash('error', 'Please log in as an admin!')
        return res.redirect('/login');
    }
    next();
}