module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const title = err.message;
  let source;
  if (err.source) {
    source = { pointer: err.source };
  }

  let detail;
  if (req.app.get('env') === 'development' && err.detail) {
    detail = err.detail();
  }

  res
    .status(status)
    .type('application/vnd.api+json')
    .json({
      errors: [
        {
          status,
          source,
          title,
          detail,
        },
      ],
    });
};
