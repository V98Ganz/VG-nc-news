exports.sqlErrors = (err, req, res, next) => {
  // console.log(err.code)
  const sqlBadRequests = ['42703'];
  if (sqlBadRequests.includes(err.code)) {
    res.status(400).send({msg: 'Bad Request'})
  } else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({msg: err.msg})
  } else next(err)
}

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
};
