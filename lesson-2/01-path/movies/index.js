import path from 'node:path';
import * as fs from 'node:fs/promises';

function readMovies() {
  const FILE_PATH = path.resolve('movies', 'movies.txt');

  return fs.readFile(FILE_PATH, { encoding: 'utf-8' });
}

export { readMovies };
