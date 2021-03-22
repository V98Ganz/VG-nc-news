const { fetchTopics, makeTopic } = require("../models/topics");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
    const topic = req.body
    makeTopic(topic).then(([topic]) => {
        res.status(201).send({ topic })
    })
    .catch(next)
}