const bcrypt = require('bcryptjs');
const User = require('../models/UserCredSchema');

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');

    if(message.length > 0){
        message = message[0];   
    }else{
        message = null
    }

    res.render('signup', {
        title: 'Signup',
        errorMessage: message,
        hasError: false
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const admin = req.body.admin;

    if (confirmPassword != password) {
        res.render('signup', {
            title: 'Signup',
            hasError: true,
            errorMessage: 'Password tidak sama!',
            user: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
        })
    } else {
        User.findOne({
            email: email
        })
        .then(userDoc => {
            if(userDoc) {
                req.flash('error', 'Email sudah terdaftar, silahkan gunakan email lain')
                return res.redirect('/signup');
            }
    
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword,
                        admin: admin
                    });
    
                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        })
    }
}

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');

    if(message.length > 0) {
        message = message[0];
    }else{
        message = null
    }

    res.render('login', {
        title: 'Login',
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password.')
            return res.redirect('/login');
        }

        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if (doMatch){
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        if (user.admin) {
                            res.redirect('/admin')
                        } else {
                            res.redirect('/');
                        }
                    });
                }

                req.flash('error', 'Invalid email or password.')
                res.redirect('/');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            })
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
}

exports.getHome = (req, res, next) => {
    res.render('home', {
        title: 'Homepage User'
    })
}

exports.getHomeAdmin = (req, res, next) => {
    res.render('homeAdmin', {
        title: 'Homepage Admin'
    })
}