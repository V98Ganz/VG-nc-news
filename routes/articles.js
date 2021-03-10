const articlesRouter = require("express").Router();
const { getArticlesById } = require("../controllers/articlesCont");

articlesRouter.route("/:article_id").get(getArticlesById);

module.exports = articlesRouter;
