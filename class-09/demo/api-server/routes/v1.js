"use strict";

const express = require("express");
const router = express.Router();

// This v1.js DEPENDS on this stuff from food.js/books.js - so let's look at those to get a better idea
const food = require("../models/food.js");
const books = require("../models/books.js");

// What we want is that /api/v1/<model>/ ends up using the right module from the models folder
// Let the class lead the "how" discussion and land on a simplistic solution like this one
// Lab will be for them to make this 100% dynamic and safe
function getModel(req, res, next) {
    let model = req.params.model; // This will be food, books, whatever is after /api/v1

    // How can we get the right model into those functions?
    // Well,l middleware is really good at letting us put data on the request object
    // Lets do that and then get get ourselves back into the route handler
    switch (model) {
        case "food":
            req.model = food;
            next();
            return;
        case "books":
            req.model = books;
            next();
            return;
        default:
            next("Invalid Model");
            return;
    }
}

router.param("model", getModel);

// OLD WAY: Would be having these routes for BOTH food and books - i.e. category/products - but we could do it in one
// These are the same ROUTES - just with DIFFERENT RESOURCES (aka food vs books) - this would get super old, super fast if you had say, 5-10 resources (which isn't at all uncommon for a website)
// Ideally you don't want to have to do all this boilerplate stuff again and again (and that's even before you write the functions)

// // Route Definitions - OLD WAY
// router.get('/api/v1/food', handleGetAllFood);
// router.post('/api/v1/food', handlePostFood);
// router.get('/api/v1/food/:id', handleGetOneFood);

// // Route Definitions - OLD WAY
// router.get('/api/v1/book', handleGetAllBooks);
// router.post('/api/v1/book', handlePostBook);
// router.get('/api/v1/book/:id', handleGetOneBook);

// Writing all this again and again is super error prone and super DRUDGERY - you'd have to write this as many times as you were duplicating that style of function (and have a very good chance of introducing and replicating a bug)
// What if you want to change it from PROMISES to ASYNC/AWAIT?? You'll have to change EVERYTHING

// Really good expression: Programmers are lazy, and programmers are illing to work REALLY HARD to AVOID WORK
// (i.e., put in the work up front to keep your code DRY - for example, let's make one getAll, one handlePost, one delete, one update, etc)
// As long as we can meet/follow the rule that says we'll behave the same way in the function, we can have everything in one spot
// Being able to FIND and FIX things in one spot is definitely a winning strategy (and definitely worth whatever tiny performance hit there is for routing things through a codebase)
// There's just ONE BIG THING that needs to happen:

// function handleGetAllBooks(req, res, next) {
//   books
//     .get()
//     .then((results) => {
//       let count = results.length;
//       res.json({ count, results });
//   })
//   .catch(next);
// }

// Route Definitions
router.get("/api/v1/:model", handleGetAll);
router.post("/api/v1/:model", handlePost);
router.get("/api/v1/:model/:id", handleGetOne);

// Route Handlers
function handleGetAll(req, res, next) {
    req.model
        .get()
        .then((results) => {
            let count = results.length;
            res.json({ count, results });
        })
        .catch(next);
}

function handleGetOne(req, res, next) {
    let id = req.params.id;
    req.model
        .get(id)
        .then((record) => res.json(record))
        .catch(next);
}

function handlePost(req, res, next) {
    req.model
        .post(req.body)
        .then((result) => res.json(result))
        .catch(next);
}

module.exports = router;
