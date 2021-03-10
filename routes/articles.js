const articlesRouter = require("express").Router();
const { getArticlesById, patchArticleById, postCommentByArticleId } = require("../controllers/articlesCont");

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .post(postCommentByArticleId)

module.exports = articlesRouter;
