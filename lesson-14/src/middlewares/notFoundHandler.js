// eslint-disable-next-line no-unused-vars
export function notFoundHandler(req, res, next) {
  res.status(404).send({ status: 404, message: 'Not found' });
}
