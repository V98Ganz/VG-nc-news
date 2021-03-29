const usersRouter = require("express").Router();
const { handle405s } = require('../errorHandlers/errors');
const { 
    getUsernameByName,
    postUser,
    getUsers,
} = require("../controllers/usersCont");

usersRouter
    .route("/:username")
    .get(getUsernameByName)
    .all(handle405s);

usersRouter
    .route('/')
    .post(postUser)
    .get(getUsers)
    .all(handle405s);
    
module.exports = usersRouter;
