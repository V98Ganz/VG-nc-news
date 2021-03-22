const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  checkIfTopicExists,
  checkIfArticleExists,
  removeArticleById,
} = require("../models/articles");
const { checkIfUserExists } = require("../models/users");

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
  if (inc_votes) {
    updateArticleById(article_id, inc_votes)
      .then(([article]) => {
        res.status(201).send({ article });
      })
      .catch(next);
  } else {
    fetchArticleById(article_id)
      .then(([article]) => {
        delete article["comment_count"];
        res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  const promises = [fetchArticles(query)];
  if (query.author) {
    promises.push(checkIfUserExists(query.author));
  }
  if (query.topic) {
    promises.push(checkIfTopicExists(query.topic));
  }
  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkIfArticleExists(article_id)
    .then((returnedPromise) => {
      if (!returnedPromise) {
        removeArticleById(article_id).then((article) => {
          res.status(204).send({ article });
        });
      }
    })
    .catch(next);
};
