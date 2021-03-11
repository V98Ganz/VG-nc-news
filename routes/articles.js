const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require("../controllers/articlesCont");

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
