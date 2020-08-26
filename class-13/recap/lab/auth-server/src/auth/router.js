"use strict";

const express = require("express");
const authRouter = express.Router();

const User = require("./users-model.js");
const auth = require("./basic-auth-middleware.js");
const oauthMiddleware = require("./middleware/oauth.js");
const usersModel = require("./users-model.js");

authRouter.post("/signup", async (req, res, next) => {
    // POST to /signup is supposed to CREATE a new user, and then GENERATE a token - and then attach that token on the REQUEST
    const user = await User.create(req.body);
    // we want to generate a token and STORE it back on the request (req.token property)
    const token = await user.generateToken();
    // Response body constructed with token and user
    const responseBody = {
        token,
        user,
    };
    // Response body being sent back
    res.send(responseBody);
});

authRouter.post("/signin", auth, (req, res, next) => {
    res.cookie("auth", req.token); // request put here by auth middleware
    res.set("token", req.token); // set a token header

    res.send({
        token: req.token,
        user: req.user,
    });
});

authRouter.get("/oauth", oauthMiddleware, (req, res, next) => {
    res.status(200).send(req.token);
});

module.exports = authRouter;
