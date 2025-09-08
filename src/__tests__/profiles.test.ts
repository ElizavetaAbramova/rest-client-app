import { describe, it, expect } from 'vitest';
import * as mod from '@/constants/profiles';

type ProfilesModule = { default?: unknown } & Record<string, unknown>;

function getData(m: ProfilesModule): unknown {
  return 'default' in m ? m.default : m;
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

describe('profiles constants', () => {
  it('loads and exposes non-empty data', () => {
    const data = getData(mod as ProfilesModule);

    if (Array.isArray(data)) {
      expect(data.length).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(3, data.length); i++) {
        void data[i];
      }
    } else if (isRecord(data)) {
      const keys = Object.keys(data).filter((k) => k !== '__esModule');
      expect(keys.length).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(3, keys.length); i++) {
        void data[keys[i]];
      }
    } else {
      expect.fail('profiles exports neither an array nor an object');
    }
  });
});
