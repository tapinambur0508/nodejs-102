import express from 'express';
import pinoHTTP from 'pino-http';

const app = express();
const pino = pinoHTTP({
  transport: {
    target: 'pino-pretty',
  },
});

app.use(pino);

function middlewareA(req, res, next) {
  console.log('Middleware A');
  next();
}

function middlewareB(req, res, next) {
  console.log('Middleware B');
  next();
}

function middlewareC(req, res, next) {
  console.log('Middleware C');
  next();
}

app.use(middlewareA); // app.use("*", middlewareA);
app.use('/not-found', middlewareB);

app.get(
  '/',
  middlewareC,
  middlewareC,
  middlewareC,
  middlewareC,
  middlewareC,
  (req, res) => {
    res.send('Hello, World!');
  },
);

// Handle 404 Error
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).send({ status: 404, message: 'Route not found:(' });
});

// Handle Server Error
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).send({ status: 500, message: 'Internal Server Error' });
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
