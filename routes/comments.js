const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  deleteCommentById,
} = require("../controllers/commentsCont");
const { handle405s } = require("../errorHandlers/errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsById)
  .delete(deleteCommentById)
  .all(handle405s);

module.exports = commentsRouter;
