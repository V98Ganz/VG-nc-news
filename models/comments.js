const dbConnection = require("../db/dbConnection");

exports.updateCommentById = (id, votes = 0) => {
  return dbConnection
    .from("comments")
    .where({
      comment_id: id,
    })
    .increment("votes", votes)
    .returning(["comment_id", "votes", "created_at", "author", "body"]);
};

exports.removeCommentById = (id) => {
  return dbConnection
    .from("comments")
    .del()
    .where({
      comment_id: id,
    })
    .then((results) => {
      return results;
    });
};

exports.createCommentByArticleId = (id, contents) => {
  const insertIt = {
    author: contents.username,
    body: contents.body,
    article_id: id,
  };
  return dbConnection
    .from("comments")
    .insert(insertIt)
    .returning(["comment_id", "votes", "created_at", "author", "body"]);
};

exports.fetchCommentsByArticleId = (id, query) => {
  return dbConnection
    .from("comments")
    .where({
      article_id: id,
    })
    .select("comment_id", "votes", "created_at", "author", "body")
    .modify((queryBuilder) => {
      let order = "desc";
      let sort_by = "created_at";
      let limit = 10;
      let page = 0;
      if (query.order) {
        order = query.order;
      }
      if (query.sort_by) {
        sort_by = query.sort_by;
      }
      if (query.limit) {
        limit = query.limit
      }
      if (query.p) {
        page = (query.p - 1) * limit;
      }
      queryBuilder.limit(limit)
      queryBuilder.offset(page)
      queryBuilder.orderBy(sort_by, order);
    });
};

exports.checkIfCommentExists = (id) => {
  return dbConnection
    .from("comments")
    .where({
      comment_id: id,
    })
    .then(([comment]) => {
      if (comment === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
    });
};
