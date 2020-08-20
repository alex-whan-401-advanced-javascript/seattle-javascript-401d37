"use strict";

class DataModel {
    // What's this schema? We know there's SOMETHING called schema getting passed in here and getting stored as a PROP
    // Looks like schema is getting called below. Basically, take all the props of the schema, and they become props of this DataModel
    constructor(schema) {
        this.schema = schema;
    }

    // What is GET doing/returning?
    // It's returning a COLLECTION OF MODEL INSTANCES/RECORDS (like Notesy) - this case could be FOOD or BOOKS
    // Think of MODEL INSTANCE = RECORD
    // It's sending back a COLLECTION OF RECORDS
    // IF someone calls this GET method with no arguments (like get()) - what does the value of ID become if it's called with nothing?
    // Strictly speaking, it's the default JS gives anything when it's not given an explicit value - UNDEFINED
    // REMEMBER: Every time you see ANY argument in JavaScript, you can imagine that it has an implicit default value of UNDEFINED - imagine it as get(id=undefined)
    get(id) {
        // Checking to see: "If ID"
        // Under what conditions will the JS interpreter get to this IF statement and run this code?
        // If ID is TRUTHY (this is important) - aka, anything other than 0, false, undefined, null, NaN, empy string - you're going to hit it
        // Remember: UNDEFINED is NOT truthy (neither is 0) - so you wouldn't hit the line below
        // This function is saying: You can call me multiple ways (pass in something as an ID, pass in NOTHING as an ID)
        // This is important because we'll have URLs that look like: GET api/v1/food and GET api/v1/food/2 - and we want to be able to support BOTH of these
        // They're both GETs that want to know something about food - but if you tell it nothing, we're telling it 'get ALL the Foods', whereas if you put in an ID, we're telling it to 'get the food with THAT specific ID'
        // if you DON'T find anything, you want to return an empty object("find" with an empty object is how you do it with MONGOOSE)
        if (id) {
            return this.schema.findById(id);
        } else {
            return this.schema.find({});
        }
    }

    // Record = the raw info needed to create this new INSTANCE
    post(record) {
        // Refers to the CONSTRUCTOR of whatever Schema is
        let newRecord = new this.schema(record);
        // Returns a Promise that will RESOLVE once this record has been saved
        return newRecord.save();
    }
}

// Note: this is SUPER generic code that ANYONE can use - as long as their data you pass in has certain traits (i.e. some rules about what the methods take in)
// But, right now: As long as schema gives the info THESE methods are looking for, it provides a SUPER CLEAN WAY of interacting with some underlying data model
// This is pretty unlikely to break - and if it does, you only have to go through 25-50 lines of code instead of like 500
// Probably will work for like 99% of models
// BOTTOM LINE: Really hinges on whatever the SCHEMA is - let's look

module.exports = DataModel;
