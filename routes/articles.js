const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById,
  getArticles,
} = require("../controllers/articlesCont");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/commentsCont");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
