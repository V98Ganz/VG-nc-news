const endpoints = require('../endpoints.json')

exports.getAllRoutes = (req, res, next) => {
        res.status(200).send(({endpoints}))
}