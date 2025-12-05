const express = require("express")
const router = express.Router()
const request = require('request')


router.get('/books', function (req, res, next) {
    let search = req.query.search;
    let minprice = req.query.minprice;
    let maxprice = req.query.max_price;
    let sort = req.query.sort;

    // Base query
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let params = [];

   
    if (search) {
        sqlquery += " AND name LIKE ?";
        params.push(`%${search}%`);
    }

    if (minprice) {
        sqlquery += " AND price >= ?";
        params.push(minprice);
    }

    if (maxprice) {
        sqlquery += " AND price <= ?";
        params.push(maxprice);
    }


    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    } else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    // Run the query
    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json({ error: err });
            return next(err);
        }
        res.json(result);
    });
});
module.exports = router