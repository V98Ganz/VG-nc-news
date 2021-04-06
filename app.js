const express = require("express");
const apiRouter = require("./routes/api");
const {
  handle500,
  handleCustomErrors,
  sqlErrors,
  handle405s,
} = require("./errorHandlers/errors");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handle405s)
app.use(sqlErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
