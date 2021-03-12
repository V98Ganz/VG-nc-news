const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  checkIfTopicExists,
  checkIfArticleExists
} = require("../models/articles");
const {checkIfUserExists} = require('../models/users')

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchArticleById(article_id), checkIfArticleExists(article_id)])
    .then(([article]) => {
      res.status(200).send({ article: article[0] });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  const promises = [fetchArticles(query)]
  if (query.author) {
    promises.push(checkIfUserExists(query.author))
  }
  if (query.topic) {
    promises.push(checkIfTopicExists(query.topic))
  }
  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
