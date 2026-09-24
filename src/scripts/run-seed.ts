// src/scripts/run-seed.ts
import { runSeed } from '../db/seed.ts';

runSeed()
  .then(() => {
    console.log('Seed execution finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed execution error:', err);
    process.exit(1);
  });
