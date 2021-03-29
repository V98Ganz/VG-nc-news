const usersRouter = require("express").Router();
const { getUsernameByName, postUser } = require("../controllers/usersCont");
const { handle405s } = require('../errorHandlers/errors');

usersRouter
    .route("/:username")
    .get(getUsernameByName)
    .all(handle405s);

usersRouter
    .route('/')
    .post(postUser)
    .all(handle405s);
    
module.exports = usersRouter;
