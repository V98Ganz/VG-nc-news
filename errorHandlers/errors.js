exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({msg: err.msg})
  } else next(err)
}

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
};
