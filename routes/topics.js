const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsCont");
const { handle405s } = require("../errorHandlers/errors");

topicsRouter
    .route("/")
    .get(getTopics)
    .all(handle405s);

module.exports = topicsRouter;
