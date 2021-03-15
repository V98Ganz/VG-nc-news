const dbConnection = require("../db/dbConnection");

exports.fetchArticleById = (id) => {
  return dbConnection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count("comments.article_id as comment_count")
    .groupBy("articles.article_id")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where({
      "articles.article_id": id,
    });
};

exports.updateArticleById = (id, votes = 0) => {
  return dbConnection
    .select("*")
    .from("articles")
    .where({
      article_id: id,
    })
    .increment("votes", votes)
    .returning("*");
};

exports.fetchArticles = (query) => {
  return dbConnection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count("comments.article_id as comment_count")
    .groupBy("articles.article_id")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .modify((queryBuilder) => {
      let order = "desc";
      let column = "created_at";
      let filterByAuthor = true;
      let filterByTopic = true;
      if (query.sort_by) {
        column = query.sort_by;
      }
      if (query.order) {
        order = query.order;
      }
      if (query.author) {
        filterByAuthor = {
          "articles.author": query.author,
        };
      }
      if (query.topic) {
        filterByTopic = {
          "articles.topic": query.topic,
        };
      }
      queryBuilder.where(filterByAuthor);
      queryBuilder.where(filterByTopic);
      queryBuilder.orderBy(column, order);
    });
};

exports.checkIfTopicExists = (topic) => {
  return dbConnection
    .from("articles")
    .where({
      topic: topic,
    })
    .then(([topic]) => {
      if (topic === undefined) {
        return Promise.reject({
          status: 404,
          msg: "No such topic",
        });
      }
    });
};

exports.checkIfArticleExists = (id) => {
  return dbConnection
    .from('articles')
    .where({
      article_id: id
    })
    .then(([article]) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: 'Article not found'
        })
      }
    })
}