const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticleById,
  getArticles,
  deleteArticleById,
} = require("../controllers/articlesCont");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/commentsCont");
const {handle405s} = require('../errorHandlers/errors')

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405s)

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(handle405s)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405s)

module.exports = articlesRouter;
