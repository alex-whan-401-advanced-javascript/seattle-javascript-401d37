// We already have a MODEL - so we just need a products-schema
"use strict";

const schema = require("./products-schema.js"); // require a schema
const DataModel = require("./model.js"); // require a data model
// REMEMBER: The DATA MODEL is the SUPERCLASS that's going to provide the INTERFACE (the generic "model"/collection/mongo)

// May not even need anything else here - everything we need is already up in the Superclass (and don't have to do super() because we're not adding anything)
class Products extends DataModel {}

// Implicitly - this is like calling super()
// class Products extends DataModel {
//     // If you want POST to be different than the DEFAULT BEHAVIOR of a DATA MODEL (aka the Superclass) - then you can just "jump in front" and change it up - like below
//     // If a POST doesn't exist, it'll jump up to the next class it's defined in

//     // Explanation example: Products has a rule that name must be lower case.
//     post(record) {
//       // This is JUST checking to see if it has a name and making it lowercase if so - basically saying: apply this rule ONLY to PRODUCTS - and everything else will still happen that would've happened
//         if (record.name) {
//             record.name = record.name.toLowerCase();
//         }
//         // After this point, the superclass POST will do whatever it would've done as if nothing had happened
//         return this.post(record);
//     }

// Pass schema into a NEW INSTANCE OF THIS CLASS
// Exports a new INSTANCE of this class - not the class itself
module.exports = new Products(schema);

// Ultimately we're saying: Products, Food, Books, Categories, whatever.... they should all MODEL things the SAME WAY and have CRUD conventions and RESTful CONVENTIONS

// However, if you ever have to change anything or customize, you'll have to think about it

// i.e.: We want GET to behave the same way with products/food - but we want POST to behave slightly differently in a way that doesn't break either - how can we specialize Products to have unique POST but same GET and not mess up Food/Books?
// I think the answer is probably with the super() call:

// Can add a "POST" to Products that will step in front of the "Superclass"
// Make sure you match the SIGNATURE of POST (i.e., takes in a record, returns a Promise)
