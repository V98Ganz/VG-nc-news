const dbConnection = require("../db/dbConnection");

exports.updateCommentById = (id, votes) => {
    return dbConnection
        .select('*')
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
