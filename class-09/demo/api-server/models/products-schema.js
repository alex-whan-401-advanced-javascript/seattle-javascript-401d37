<<<<<<< HEAD
"use strict";

const mongoose = require("mongoose");

// Look at the v1.js - there's a "getModel" function
// We'd like to have routes that are just like '/api/v1/etc'

const products = mongoose.Schema({
    name: { type: String, required: true },
    //etc:
    // category: { type: Number, required: true },
    // type: {
    //     type: String,
    //     uppercase: true,
    //     enum: ["FRUIT", "VEGETABLE", "PROTIEN"],
    // },
});

// "collection" = "database" (I think) in MongoDB/Mongoose
// This is saying that the "collection" will be called "products" - instances of this schema will go into the "products" collection I believe
module.exports = mongoose.model("products", products);

// JB: I like naming my models SINGULAR, but his TEAM likes plural, so that's what they do
