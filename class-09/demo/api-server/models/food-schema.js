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
