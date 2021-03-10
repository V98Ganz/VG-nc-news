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
        created_at: "2021-03-10T16:36:19.310Z"
    }
    return dbConnection
        // .select('*')
        .from('comments')
        .insert(insertIt)
        .where({
            article_id: id
        })
        .returning('*')
}