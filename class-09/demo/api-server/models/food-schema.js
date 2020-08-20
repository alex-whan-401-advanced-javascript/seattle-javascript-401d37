"use strict";

// This is what gets fed into the model
// THIS IS A MONGOOSE MODEL - being created off of the SUPPLIED mongoose SCHEMA below
const mongoose = require("mongoose");

const food = mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    type: {
        type: String,
        uppercase: true,
        enum: ["FRUIT", "VEGETABLE", "PROTIEN"],
    },
});

module.exports = mongoose.model("food", food);

// FOOD SCHEMA and FOOD.JS are really tightly bound - why do we have them separated? We can ask this question. In theory we could re-combine them if it becomes "TOO" modular.
// JB: Fair argument to be made that ONE file is better (since it's not increasing size that much) - however it the files were longer, it maybe wouldn't be as good of an argument. Ultimately, find the balance that works for you

// It clumps together the pieces that you WANT to be clumped together anyway

// (i.e., the FOOD MODEL in our context means: "a combo of a MONGOOSE SCHEMA and this DATA MODEL SUPERCLASS") - so why not just combine them? Worth thinking about.
