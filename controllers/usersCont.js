const {fetchUserByUsername, checkIfUserExists} = require("../models/users");

exports.getUsernameByName = (req, res, next) => {
    const {username} = req.params;
    Promise.all([fetchUserByUsername(username), checkIfUserExists(username)])
  .then(([user]) => {
    if (user.length)
    res.status(200).send({user: user[0]});
  })
  .catch(next)
};
