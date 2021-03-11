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

exports.createCommentByArticleId = (id, contents) => {
  const insertIt = {
    author: contents.username,
    body: contents.body,
    article_id: id,
    votes: 0,
    created_at: "2021-03-10T16:36:19.310Z",
  };
  return (
    dbConnection
      // .select('*')
      .from("comments")
      .insert(insertIt)
      .where({
        article_id: id,
      })
      .returning("*")
  );
};

exports.fetchCommentsByArticleId = (id, query) => {
  return dbConnection
    .from("comments")
    .where({
      article_id: id,
    })
    .returning("comment_id", "votes", "created_at", "author", "body")
    .modify((queryBuilder) => {
      let order = "desc";
      if (query.order) {
        order = query.order;
      }
      if (query.sort_by) {
        queryBuilder.orderBy(query.sort_by, order);
      }
    });
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
