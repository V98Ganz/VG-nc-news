exports.sqlErrors = (err, req, res, next) => {
  // console.log(err.code)
  const sqlBadRequests = ['42703'];
  if (sqlBadRequests.includes(err.code)) {
    res.status(404).send({msg: 'No such column'})
  } else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({msg: err.msg})
  } else next(err)
}

exports.handle500 = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Server error" });
};


exports.handle405s = (req, res, next) => {
  res.status(405).send({msg: 'Method not allowed'})
}