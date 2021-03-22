const dbConnection = require("../db/dbConnection");

exports.fetchTopics = () => {
  return dbConnection.select("*").from("topics");
};

exports.makeTopic = (topic) => {
    return dbConnection
        .from('topics')
        .insert({
            slug: topic.slug,
            description: topic.description
        })
        .returning('*')
};
