"use strict";

// Do "Go To Type Definition" to open the files
// Requires these in - WHY? Let's check it out
const schema = require("./food-schema.js");
const dataModel = require("./model.js");

// The fact that we're doing this syntax here gives us a pretty big clue about what comes back when we require model.js
// Model.js is exporting something, and storing it in the dataModel variable - what is dataModel based on this file?
// dataModel is a CLASS - and we're making dataModel a SUPER CLASS of FOOD
class Food extends dataModel {}

module.exports = new Food(schema);

// Think of it this way: You need 3 things, to build 1 thing
// But, those 3 things are really small

// Yesterday was that MONGO MODEL - today, this is just another same for the same sort of thing
// Yesterday we took it from the demo, and today we should build the model
// In our code, we should end up not with a combo of Food.js, food-schema.js, and foodmodel.js, but rather for product/categories
