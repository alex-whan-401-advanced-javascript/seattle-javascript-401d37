"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: "user", enum: ["admin", "editor", "user"] },
});

// TODO
// To have more "bulletproof" code and handle errors, you'd want to put these async/await functions in a TRY/CATCH block

users.pre("save", async function () {
    // This is like a "lifecycle" function/event - or a "pre-hook" - this is like saying: "This event (save) is ABOUT to occur. If you want to do something before that, now is the time."
    // Checking to see IF the password has been modified (in this case, it's more like: is it BEING modified AT THIS MOMENT?)
    // If password is modified - aka it's being saved initially:
    // We want to use contextual "this" - as we want it to refer to THIS SPECIFIC USER
    // NOTE: "this" only works here if we have an old-school "function" call - not an arrow
    if (this.isModified("password")) {
        // at the point of the await, "this.password" will be the plain text version of the password - but it'll get stored in "this.password" as the hashed password
        this.password = await bcrypt.hash(this.password, 10);
    }
    // Then hash it (We don't want raw password) - rehashing is a computationally-expensive process so we don't want to do it if we don't need to
});

users.statics.authenticateBasic = async function (username, password) {
    // Style is somewhat like attaching to a prototype (THIS ONE very much needs to be a "static" - because it's asking a whole group of users if a certain user exists - THAT concerns the whole collection)
    // STATIC = concerns the whole collection
    // Doesn't need to be async... but CAN it be anyway?
    // TODO: Check if there is a user with that username and password
    // if there is one, return it (look through collection of users and see if there's a match between username/password)
    // let query = { username };
    const user = await this.findOne({ username });
    // if there IS a good user there, check it's password
    // if not (a falsy user), we want to return that (it's not this method's responsibility to return an error)
    // logical and (&&): The second expression ONLY evaluates if the first one is TRUTHY (if falsy, just return user. if truthy, return user and result of comparePassword of user password)
    return user && (await user.comparePassword(password));
};

users.methods.comparePassword = async function (password) {
    // THIS becomes about a PARTICULAR USER (i.e. we only want to compare the password OF the user we found with authenticateBasic) - so we use "METHODS"
    // METHOD = concerns an individual instance
    const passwordMatch = await bcrypt.compare(password, this.password);
    return passwordMatch ? this : null;
};

users.methods.generateToken = async function () {
    // No arguments, synchronous
    // Returns a token
    // This is also an INSTANCE METHOD - tip-off would be in your tests - if "user" has a lowercase "u" as opposed to the "User" model/collection
    // in the SIGN method, you either give JWT a single string, OR an OBJECT with all the properties you want
    // JWT just takes that body, wraps it all up and ecrypts it, and then sends it so you can decrypt it on the other end
    // Hover over JWT.sign and you'll get some helpful info about what goes into it - i.e., a payload of string/object plus a secret key
    // Should you have role in this payload all the time? Or just now to pass the test? Answer: We're going to need it in the near future where we're going to be having different KINDS of users. Those different KINDS of users will have different ROLES that give them different levels of ACCESS into your app. Having a role with your token is important to that strategy.
    const payload = {
        // Don't HAVE to have this ID
        id: this._id,
        role: this.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
};

users.statics.createFromOauth = async function (email) {
    // Can do a basic error check here:
    // if (!email) {
    //     throw new Error("Validation Error");
    // }

    // Another way to get OUT of an async function/method by FAILING OUT:
    if (!email) {
        // SUGGESTED ERROR HANDLING IN ASYNC - PROMISE.REJECT();
        return Promise.reject("Validation Error"); // This will actually fail OUT of the method - when you're in Async world, if you're trying to create the error, this is the way to go (rather than a THROWING of the error)
    }

    // This is STATICS - because we want it to apply to the whole collection/all users (think capital U "User")
    // We want to find out if there is a USER in our COLLECTION OF USERS that matches that EMAIL (remember, we have an email property/field in the schema)
    // How do we grab any instance that matches that email? Use "findOne"
    const user = await this.findOne({ email }); // looking for a key name of email, with a value of whatever came in { email } = { email: email }

    // How do we tell that a brand new user is NOT found?
    // Check to see if user is truthy:
    if (user) {
        // return it if found/truthy
        return user;
    } else {
        // otherwise... (specified down at the bottom of the long doc?)
        // Don't await down here as test is awaiting it
        return this.create({ username: email, password: "none", email: email }); // "CREATE" method = handles the "new" and "save" for you in one step
        // CREATE is equivalent of saying: new User with { this: info }.save()
        // Alternately it would be like "new User({...}).save()"
        // CREATE is a built-in Mongoose method (check docs) - the key is it saves it for you and will hit the "pre"-save HOOK with the bcrypt password hashing
    }
};

module.exports = mongoose.model("users", users);
