import cors from 'cors';
import express from 'express';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

app.get('/movies', (req, res) => {
  res.send([
    {
      title: 'Film 1',
      year: 2020,
    },
    {
      title: 'Film 2',
      year: 2018,
    },
    {
      title: 'Film 3',
      year: 2021,
    },
  ]);
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
