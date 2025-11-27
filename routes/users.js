// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const saltRounds = 10

const router = express.Router()
const { check, validationResult } = require('express-validator');
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/register', function (req, res, next) {
    res.render('register.ejs', {errors:[]})
})

router.post('/registered', 
[
    check('first')
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),

    check('last')
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),

    check('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 5, max: 20 }).withMessage('Username must be between 5 and 20 characters'),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address'),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 50 }).withMessage('Password must be 8–50 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
],
function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array() });
    }

    // Sanitize inputs BEFORE using them
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const username = req.sanitize(req.body.username);
    const email = req.sanitize(req.body.email);
    const plainPassword = req.sanitize(req.body.password);

    // Hash the sanitized password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

        const sqlquery = `
            INSERT INTO users (username, first_name, last_name, email, hashedPassword)
            VALUES (?, ?, ?, ?, ?)
        `;
        const newUser = [username, first, last, email, hashedPassword];

        db.query(sqlquery, newUser, function(err, result) {
            if (err) return next(err);

            // Success response (DO NOT send password back)
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            });
    });
});


router.get('/list',redirectLogin,  function (req, res, next) {
    const sqlquery = "SELECT username, first_name, last_name, email FROM users"; // no password!
    db.query(sqlquery, function (err, result) {
        if (err) {
            next(err);
        } else {
            res.render('userlist.ejs', { users: result });
        }
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs');  // renders views/login.ejs
});

router.post('/loggedin', function (req, res, next) {
    const username = req.sanitize(req.body.username);;
    const password = req.sanitize(req.body.password);;

    // 1. Look up the user in the database
    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], function(err, results) {
        if (err) return next(err);

        const logAction = "INSERT INTO audit_log (username, action) VALUES (?, ?)";

        if (results.length === 0) {
            // Log failed attempt with unknown username
            db.query(logAction, [username, "login_failed_username_not_found"], (err) => {
                if (err) console.error("Audit log insert failed:", err);
            });

            return res.send("Login failed: Username not found.");
        }

        const user = results[0];

        // 2. Compare the password with the stored hashed password
        bcrypt.compare(password, user.hashedPassword, function(err, match) {
            if (err) return next(err);

            const action = match ? "login_success" : "login_failed_wrong_password";
            db.query(logAction, [user.username, action], (err) => {
                if (err) console.error("Audit log insert failed:", err);
            });

            if (match) {
                req.session.userId = req.sanitize(req.body.username);;
                res.send("Login successful. Welcome back, " + user.first_name + "!");
                
            } else {
                res.send("Login failed: Incorrect password.");
            }
        });
    });
});

router.get('/audit', redirectLogin ,function (req, res, next) {
    const sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";
    db.query(sqlquery, function(err, result) {
        if (err) return next(err);
        res.render('audit.ejs', { audit: result });
    });
});


router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})

// Export the router object so index.js can access it
module.exports = router
