const {fetchUserByUsername} = require("../models/users");

exports.getUsernameByName = (req, res, next) => {
    const {username} = req.params;
  fetchUserByUsername(username).then((user) => {
    if (user.length)
    res.status(200).send({user});
  })
  // .catch(next)
};
