"use strict";

const express = require("express");

// Custom Middleware
const errorHandler = require("../middleware/500.js");
const notFoundHandler = require("../middleware/404.js");

// Custom Routes // This is different
const apiRouter = require("../routes/v1.js");
const paramsRouter = require("../routes/params.js"); // PARAMS.JS LEADS HERE - for reference/review only - not needed in our lab!!

const app = express();

app.use(express.json());

// Actual Routes
app.use(apiRouter);
app.use(paramsRouter); // params router will run AFTER the API router, but above the catch-alls/error handler

app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: (port) => {
        let PORT = port || process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    },
};
