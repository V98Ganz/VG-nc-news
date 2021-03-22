const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topicsCont");
const { handle405s } = require("../errorHandlers/errors");

topicsRouter
    .route("/")
    .get(getTopics)
    .post(postTopic)
    .all(handle405s);

module.exports = topicsRouter;
