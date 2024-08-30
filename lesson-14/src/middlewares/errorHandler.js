import { isHttpError } from 'http-errors';

// eslint-disable-next-line no-unused-vars
export async function errorHandler(error, req, res, next) {
  console.error(error);

  if (isHttpError(error) === true) {
    return res.status(error.status).send({
      status: error.status,
      message: error.message,
    });
  }

  res.status(500).send({ status: 500, message: 'Internal Server Error' });
}
