// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
        });
});
router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [ req.sanitize(req.body.name),req.sanitize(req.body.price)]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.sanitize(req.body.name) + ' price '+ req.sanitize(req.body.price))
    })
}) 
router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT name, price FROM books WHERE price < 20"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargainbooks.ejs", {availableBooks:result})
        });
});

router.get('/search-result', (req, res, next) => {
    const keyword = req.query.search_text;
    const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    const searchTerm = `%${keyword}%`;

    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) return next(err);

        res.render('search.ejs', {
            shopData: { shopName: "Bertie's Books" },
            keyword: keyword,
            books: result
        });
    });
});
// Export the router object so index.js can access it
module.exports = router