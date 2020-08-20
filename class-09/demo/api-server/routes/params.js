"use strict";

// NOTE: THIS IS FOR US TO CHECK OUT AND HOPEFULLY BEGIN TO UNDERSTAND THIS PARAM BUSINESS - WE DON'T NEED THIS IN OUR APP!!!

const express = require("express");
const router = express.Router();

function getZip(req, res, next) {
    req.body.zip = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, 0);
    next();
}
router.param("city", getZip); // what does this mean?
// getZip will PROBABLY change this
// What kind of URLS will TRIGGER getZip to run?
// answer: ANYTHING RELATED TO "CITY"
// important note - the string "city" won't do it - needs to be the "colon / :city"

// MAIN REQUIREMENT: Have a :city somewhere in the URL
// TRIGGERED WHEN :CITY is FOUND IN URL (and REACHED)

// That middleware will not run here
// If we took this part out, the middleware below would work
// if you made this into "places/:seattle" - it would be triggered by "places/tacoma" since it matches - because it's not looking for "SEATTLE" itself - it's match that PATTERN

// Think of this like - this is LITERALLY "SEATTLE"
// Whereas below: this is "ANYTHING THAT COMES AFTER THE SLASH and it'll have the variable name "city" - could keep the functionality by changing it to anything as long as you use that "Variable" later"
router.get("/places/seattle", function (req, res, next) {
    res.send(`Zip: ${req.body.zip}`);
});

// That middleware does run here
router.get("/places/:city", function (req, res, next) {
    res.send(`Zip: ${req.body.zip}`);
});

// But not here
router.get("/flights/to/:airport", function (req, res, next) {
    res.send(`Zip: ${req.body.zip}`);
});

module.exports = router;

// MIDDLEWARE: "pretty much everything in Express is middleware"
