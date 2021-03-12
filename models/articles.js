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
    .join("comments", "articles.article_id", "=", "comments.article_id")
    .where({
      "articles.article_id": id,
    });
};

exports.updateArticleById = (id, votes) => {
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
      let order = 'desc';
      let column = 'created_at';
      let filterByAuthor = true;
      let filterByTopic = true;
      if (query.sort_by) {
        column = query.sort_by
      }
      if (query.order) {
        order = query.order
      }
      if (query.author) {
        filterByAuthor = {
          'articles.author': query.author
        } 
      }
      if (query.topic) {
        filterByTopic = {
          'articles.topic': query.topic
        }
      }
      queryBuilder.where(filterByAuthor)
      queryBuilder.where(filterByTopic)
      queryBuilder.orderBy(column, order)
    })
};