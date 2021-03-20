const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const { getAllRoutes } = require("../controllers/apiCont");
const {handle405s} = require('../errorHandlers/errors')

apiRouter
    .route("/")
    .get(getAllRoutes)
    .all(handle405s);
    
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
