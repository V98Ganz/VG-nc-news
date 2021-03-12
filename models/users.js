const dbConnection = require("../db/dbConnection");

exports.fetchUserByUsername = (username) => {
  return dbConnection.select("*").from("users").where({
    username: username,
  })
};

exports.checkIfUserExists = (username) => {
  return dbConnection
    .select("*")
    .from("users")
    .where({
      username: username,
    })
    .then(([user]) => {
      if (user === undefined) {
        return Promise.reject({
          status: 404,
          msg: `User not found`,
        });
      }
    });
};
