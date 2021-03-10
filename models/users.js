const dbConnection = require('../db/dbConnection')

exports.fetchUserByUsername = (username) => {
    return dbConnection
        .select('*')
        .from('users')
        .where({
            username: username
        })
}