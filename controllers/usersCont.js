const {
  fetchUserByUsername,
  checkIfUserExists,
  createUser,
  fetchUsers,
} = require("../models/users");

exports.getUsernameByName = (req, res, next) => {
  const { username } = req.params;
  Promise.all([fetchUserByUsername(username), checkIfUserExists(username)])
    .then(([user]) => {
      if (user.length) res.status(200).send({ user: user[0] });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const userInfo = req.body;
  createUser(userInfo).then(([user]) => {
    res.status(201).send({user});
  })
  .catch(next)
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({users})
  })
}
