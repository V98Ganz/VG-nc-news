const usersRouter = require('express').Router();
const {getUsernameByName} = require('../controllers/usersCont')

usersRouter.route('/:username').get(getUsernameByName);

module.exports = usersRouter;