import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildZip, crc32 } from './zip';

describe('zip writer', () => {
  it('computes the standard CRC-32', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  it('produces an archive that a real unzip tool reads back byte for byte', () => {
    const entries = [
      { name: 'my-game/main.py', data: 'print("שלום, world")\n' },
      { name: 'my-game/README.md', data: '# Test\n\nLine two.\n' },
    ];
    const bytes = buildZip(entries, new Date(2026, 0, 2, 3, 4, 6));
    const dir = mkdtempSync(join(tmpdir(), 'codepath-zip-'));
    const file = join(dir, 'test.zip');
    writeFileSync(file, bytes);
    // Python's zipfile is a strict reader: it validates CRCs and the central directory.
    const script = [
      'import zipfile, sys, json',
      `z = zipfile.ZipFile(${JSON.stringify(file)})`,
      'bad = z.testzip()',
      'out = {n: z.read(n).decode("utf8") for n in z.namelist()}',
      'print(json.dumps({"bad": bad, "files": out}))',
    ].join('\n');
    const result = JSON.parse(execFileSync('python3', ['-c', script]).toString());
    expect(result.bad).toBeNull();
    expect(result.files['my-game/main.py']).toBe(entries[0].data);
    expect(result.files['my-game/README.md']).toBe(entries[1].data);
  });
});
