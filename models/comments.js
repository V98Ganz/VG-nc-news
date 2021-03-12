const dbConnection = require("../db/dbConnection");

exports.updateCommentById = (id, votes) => {
    return dbConnection
        .from('comments')
        .where({
            comment_id: id
        })
        .increment('votes', votes)
        .returning('*')
};

exports.removeCommentById = (id) => {
    return dbConnection
        .from('comments')
        .del()
        .where({
            comment_id: id
        })
        .then((results) => {
            return results
        })
}

exports.createCommentByArticleId = (id, contents) => {
    const insertIt = {
      author: contents.username,
      body: contents.body,
      article_id: id
    };
    return dbConnection
        .from("comments")
        .insert(insertIt)
        .returning("*")
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