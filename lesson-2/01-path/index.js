import { readMovies } from './movies/index.js';

async function main() {
  const movies = await readMovies();

  console.log(movies);
}

main().catch((error) => console.error(error));
