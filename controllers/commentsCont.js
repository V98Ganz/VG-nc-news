const {
  updateCommentById,
  removeCommentById,
  createCommentByArticleId,
  fetchCommentsByArticleId,
} = require("../models/comments");
const {
  checkIfArticleExists,
} = require('../models/articles')

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
  if (contents.username === undefined || contents.body === undefined) {
    res.status(400).send({msg: 'Please provide all the required keys'})
  }
  else {
    Promise.all([createCommentByArticleId(article_id, contents), checkIfArticleExists(article_id)])
      .then(([comment]) => {
        res.status(201).send({ comment : comment[0]});
      })
      .catch(next);

  }
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  Promise.all([fetchCommentsByArticleId(article_id, query), checkIfArticleExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
