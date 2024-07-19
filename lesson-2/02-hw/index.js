import path from 'node:path';
import * as fs from 'node:fs/promises';

const DB_PATH = path.resolve('db.json');

fs.readFile(DB_PATH, { encoding: 'UTF-8' })
  .then((data) => JSON.parse(data))
  .then((movies) => {
    const newMovies = [
      ...movies,
      { userId: 1, id: 1000, title: 'Title 1', completed: false },
    ];
    fs.writeFile(DB_PATH, JSON.stringify(newMovies, undefined, 2));
  })
  .then(() => console.log('Done'))
  .catch((error) => console.error(error));
