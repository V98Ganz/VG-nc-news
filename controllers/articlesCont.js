const {
  fetchArticleById,
  updateArticleById,
  createCommentByArticleId,
  fetchCommentsByArticleId,
  fetchArticles,
} = require("../models/articles");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const contents = req.body;
  createCommentByArticleId(article_id, contents).then((comment) => {
    res.status(201).send({ comment });
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const query = req.query;
  fetchCommentsByArticleId(article_id, query).then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  fetchArticles(query).then((articles) => {
    res.status(200).send({ articles });
  });
};
