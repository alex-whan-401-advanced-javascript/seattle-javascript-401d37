"use strict";

const base64 = require("base-64");

const users = require("./users-model.js");

module.exports = async (req, res, next) => {
    // TODO: we have this code already - check it - the (!req.headers.authorization) stuff with the error object

    if (!req.headers.authorization) {
        next("Invalid Login!!!");
        return;
    }

    const errorObj = {
        message: "Invalid User ID/Password",
        status: 401,
        statusMessage: "Unauthorized",
    };

    // Pull out just the ecnoded part by splitting the header into an array
    let encodedPair = req.headers.authorization.split(" ").pop();

    const decoded = base64.decode(encodedPair);
    let [user, pass] = decoded.split(":");

    try {
        const validUser = await users.authenticateBasic(user, pass);
        req.token = validUser.generateToken();
        req.user = user;
        next();
    } catch (err) {
        next(errorObj);
    }
};
