import createHttpError from 'http-errors';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false });

    if (typeof result.error !== 'undefined') {
      return next(
        createHttpError(
          400,
          result.error.details.map((err) => err.message).join(', '),
        ),
      );
    }

    next();
  };
}
