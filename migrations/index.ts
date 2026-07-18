import * as migration_20251114_053218 from './20251114_053218';
import * as migration_20251114_061830 from './20251114_061830';
import * as migration_20260718_142730_wedding_rsvps_wishes from './20260718_142730_wedding_rsvps_wishes';

export const migrations = [
  {
    up: migration_20251114_053218.up,
    down: migration_20251114_053218.down,
    name: '20251114_053218',
  },
  {
    up: migration_20251114_061830.up,
    down: migration_20251114_061830.down,
    name: '20251114_061830',
  },
  {
    up: migration_20260718_142730_wedding_rsvps_wishes.up,
    down: migration_20260718_142730_wedding_rsvps_wishes.down,
    name: '20260718_142730_wedding_rsvps_wishes'
  },
];
