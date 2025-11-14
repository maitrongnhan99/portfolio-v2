import * as migration_20251114_053218 from './20251114_053218';
import * as migration_20251114_061830 from './20251114_061830';

export const migrations = [
  {
    up: migration_20251114_053218.up,
    down: migration_20251114_053218.down,
    name: '20251114_053218',
  },
  {
    up: migration_20251114_061830.up,
    down: migration_20251114_061830.down,
    name: '20251114_061830'
  },
];
