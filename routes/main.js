// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')
// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/books/addbook',function(req, res, next){
    res.render('addbook.ejs')
});

router.get('/weather', function(req, res, next) {
    let apiKey = process.env.WEATHER_API || '12766fe0ce216e94f543e0e70fd1af9e';
    let city = req.query.city;

    // If no city yet, show blank form
    if (!city) {
        return res.render('weather.ejs');
    }

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function(err, response, body) {
        if (err) return next(err);

        let weatherData;

        try {
            weatherData = JSON.parse(body);
        } catch (e) {
            return res.render('weather.ejs', { error: "Could not parse weather data." });
        }

        if (weatherData.cod != 200) {
                return res.render('weather.ejs', { error: weatherData.message });

        }

        res.render('weather.ejs', { weather: weatherData });
    });
});

// Export the router object so index.js can access it
module.exports = router