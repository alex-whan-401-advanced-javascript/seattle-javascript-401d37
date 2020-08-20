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
    // This is like saying: Find out what model we're on by looking at the URL - checking for the thing that's in the URL like /api/v1/:model = /api/v1/food
    // FOOD will be the VALUE that fills out that MODEL "PARAMETER"

    let model = req.params.model; // This will be food, books, whatever is after /api/v1
    // NOTE the difference between "req.params.model" and "req.model"

    // How can we get the right model into those functions?
    // Well,l middleware is really good at letting us put data on the request object
    // Lets do that and then get get ourselves back into the route handler

    // We want code that inspects the model, and figures out which one it is
    // getModel looks at the params - the way we can figure it out is pretty simple: just a quick switch case
    // Just like: if it's "food", give us the "food model"
    // NOTE the difference between "req.params.model" and "req.model"
    // Adding a key/value to the reqest - basically, we're ASSOCIATING a string called 'food' with a MODEL called FOOD
    // This is how we can use the whole 'router.param' thingy - it'll insert this param
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

// This is saying like: EVERY ROUTE - listen up! Any route that's using a ":model", I want you to NOTICE that. When you notice it, run the getModel Middleware function - so you end up with the correct MODEL you want ON THE REQUEST.
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

// Now we can use these with the correct MODEL connected to the REQUEST - as we have a req.model that's the correct one - from the Route Handlers above:

// Route Definitions
router.get("/api/v1/:model", handleGetAll);
router.post("/api/v1/:model", handlePost);
router.get("/api/v1/:model/:id", handleGetOne);

// Route Handlers
// This is a very common way of returning Data (have an OBJECT that has a COUNT and a RESULTS)
// Probably SECOND most common (most common is just "the results" - think a full list of objects?)
function handleGetAll(req, res, next) {
    req.model
        .get()
        .then((results) => {
            let count = results.length;
            res.json({ count, results });
        })
        .catch(next);
}

// Inspects ID
// Calls req.model.get WITH that ID
// But what is REQ.MODEL?: We built the mode already that we're referring to. It's an INSTANCE of a SUB-CLASS of MODEL/DATAMODEL.
// Because it's a sub-class - it'll be "product", "food", or "books", etc
// So, it'll be a particular model: Food, Products, Books, etc
// Important - because, when we call GET on them, it'll be FETCHING them from DIFFERENT COLLECTIONS
function handleGetOne(req, res, next) {
    let id = req.params.id;
    req.model
        .get(id)
        .then((record) => res.json(record))
        .catch(next); // normally we'd call next like "next()" - in our middlewares, we're very explicitly calling it RIGHT THEN and there. Some middlewares along the line will send a response - and when we send a response (i.e. res.json() or res.send()) - this catch will feed an ERROR into "next" - alot going on there
    // MEans: When the .catch happens, the async promise was NOT resolved successfully. CATCH wants a function to run when this error occurs. So, we PASS it a function (we don't CALL it). "If and only if something goes wrong here, and only then, "next" is the function I want you to execute"
    // Check out the "default" case on the switch statement - where "next" is passed something - NEXT will consider that an error, at which point it'll jump to the ERROR HANDLER elsewhere - and the error Handler has 4 arguments (1st arg is "error" then req, res, next)
    // Remember: res.json() is like a "convenience method" for sending JSON - it's like "res.send()" but for JSON specifically
}

function handlePost(req, res, next) {
    req.model
        .post(req.body)
        .then((result) => res.json(result))
        .catch(next);
}

module.exports = router;
