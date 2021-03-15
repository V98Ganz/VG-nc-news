exports.sqlErrors = (err, req, res, next) => {
  // console.log(err.code.slice(0, 1))
  const sqlBadRequests = ['42703', '22P02'];
  if (sqlBadRequests.includes(err.code)) {
    if (err.code.slice(0, 2) === '42') {
      res.status(405).send({msg: 'No such column'})
    }
    if (err.code.slice(0, 2) === '22') {
      res.status(405).send({msg: 'Invalid text representation'})
    }
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