const express = require('express');
const apiRouter = require('./routes/api');
const {handle500, handleCustomErrors, sqlErrors} = require('./errorHandlers/errors')
const app = express();

app.use(express.json())

app.use('/api', apiRouter);

app.use(sqlErrors)
app.use(handleCustomErrors)
app.use(handle500)


module.exports = app;