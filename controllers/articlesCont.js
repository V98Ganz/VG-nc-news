const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  checkIfCorrectQuery
} = require("../models/articles");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then(([article]) => {
    res.status(200).send({ article });
  })
  .catch(next)
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes).then(([article]) => {
    res.status(200).send({ article });
  })
  .catch(next)
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  fetchArticles(query)
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch(next)
};
