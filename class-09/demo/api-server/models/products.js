// We already have a MODEL - so we just need a products-schema
"use strict";

const schema = require("./products-schema.js"); // require a schema
const DataModel = require("./model.js"); // require a data model
// REMEMBER: The DATA MODEL is the SUPERCLASS that's going to provide the INTERFACE (the generic "model"/collection/mongo)

// May not even need anything else here - everything we need is already up in the Superclass (and don't have to do super() because we're not adding anything)
// Implicitly - this is like calling super()
class Products extends DataModel {}

// Pass schema into a NEW INSTANCE OF THIS CLASS
// Exports a new INSTANCE of this class - not the class itself
module.exports = new Products(schema);
