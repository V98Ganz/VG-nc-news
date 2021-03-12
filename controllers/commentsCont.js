const { updateCommentById, removeCommentById } = require("../models/comments");

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const {inc_votes} = req.body;
  updateCommentById(comment_id, inc_votes).then((comment) => {
    res.status(200).send({ comment });
  })
};

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    removeCommentById(comment_id).then((comment) => {
        res.status(204).send({comment})
    })
}