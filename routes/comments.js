const commentsRouter = require("express").Router();
const {
  patchCommentsById,
  deleteCommentById,
} = require("../controllers/commentsCont");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
