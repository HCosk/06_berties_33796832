// Create a new router
const express = require("express")
const bcrypt = require('bcrypt')
const saltRounds = 10

const router = express.Router()

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err)
        }
        const sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)"
        const newUser = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ]

        db.query(sqlquery, newUser, function(err, result) {
            if (err) {
                return next(err)
            } else {
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            }
        })
    })                                                                           
})


router.get('/list', function (req, res, next) {
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
    const username = req.body.username;
    const password = req.body.password;

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
        bcrypt.compare(password, user.hashed_password, function(err, match) {
            if (err) return next(err);

            const action = match ? "login_success" : "login_failed_wrong_password";
            db.query(logAction, [user.username, action], (err) => {
                if (err) console.error("Audit log insert failed:", err);
            });

            if (match) {
                res.send("Login successful. Welcome back, " + user.first_name + "!");
            } else {
                res.send("Login failed: Incorrect password.");
            }
        });
    });
});

router.get('/audit', function (req, res, next) {
    const sqlquery = "SELECT * FROM audit_log ORDER BY timestamp DESC";
    db.query(sqlquery, function(err, result) {
        if (err) return next(err);
        res.render('audit.ejs', { audit: result });
    });
});
// Export the router object so index.js can access it
module.exports = router
