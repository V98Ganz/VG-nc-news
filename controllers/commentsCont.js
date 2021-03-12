const {
  updateCommentById,
  removeCommentById,
  createCommentByArticleId,
  fetchCommentsByArticleId,
} = require("../models/comments");

exports.patchCommentsById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const contents = req.body;
  createCommentByArticleId(article_id, contents)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  fetchCommentsByArticleId(article_id, query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
