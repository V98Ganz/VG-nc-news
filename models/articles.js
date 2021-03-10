const dbConnection = require('../db/dbConnection');

exports.fetchArticleById = (id) => {
    return dbConnection
        .select('articles.author', 'title', 'articles.article_id', 'articles.body', 'topic', 'articles.created_at', 'articles.votes')
        .from('articles')
        .count('comments.article_id as comment_count')
        .groupBy('articles.article_id')
        .join('comments', 'articles.article_id', '=', 'comments.article_id')
        .where({
            'articles.article_id': id
        })
}