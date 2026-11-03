import { test, expect } from "bun:test";
import { readFileSync, writeFileSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { sourceSnapshots } from "./source-snapshots";
import { validateCase } from "./cases";

test("archive evidence matches the actual frozen ZIP member names and text", () => {
  const c = Bun.YAML.parse(readFileSync("tests/cases/essentials/festival.yaml", "utf8")) as any;
  const s = c.source_snapshots[0], work = "tests/fixtures/scenarios/festival";
  expect(sourceSnapshots(work, {[s.path]:"(binary file)"}, [s], true)[s.path]).toBe(s.text);
  const ran = spawnSync("python3", ["-c", "import zipfile,json,sys; z=zipfile.ZipFile(sys.argv[1]); print(json.dumps({n:z.read(n).decode() for n in z.namelist()}))", join(work,s.path)], {encoding:"utf8"});
  expect(ran.status).toBe(0);
  const members = JSON.parse(ran.stdout);
  expect(Object.keys(members)).toHaveLength(4);
  for (const [name, text] of Object.entries(members)) {
    expect(s.text).toContain(`## ${name}\n\n${text}`);
  }
});
test("stale snapshots never supply old claims, and invalid/path-escaping declarations fail", () => {
  const root = mkdtempSync(join(tmpdir(), "source-snapshot-"));
  try {
    writeFileSync(join(root,"archive.zip"), "old bytes");
    const s = {path:"archive.zip",sha256:new Bun.CryptoHasher("sha256").update("old bytes").digest("hex"),text:"Old claims"};
    expect(sourceSnapshots(root, {[s.path]:"binary"}, [s], true)[s.path]).toBe("Old claims");
    writeFileSync(join(root,"archive.zip"), "changed bytes");
    expect(() => sourceSnapshots(root, {[s.path]:"binary"}, [s], true)).toThrow("hash mismatch");
    expect(sourceSnapshots(root, {[s.path]:"binary"}, [s])[s.path]).toContain("withheld");
    expect(sourceSnapshots(root, {}, [s])).toEqual({});
    writeFileSync(join(root,"target.bin"), "old bytes"); rmSync(join(root,"archive.zip"));
    symlinkSync("target.bin",join(root,"archive.zip"));
    expect(() => sourceSnapshots(root, {[s.path]:"symlink"}, [s], true)).toThrow("hash mismatch");
    expect(sourceSnapshots(root, {[s.path]:"symlink"}, [s])[s.path]).toContain("withheld");
    for (const bad of [{...s,path:"../escape"},{...s,sha256:"bad"},{...s,text:""}])
      expect(() => validateCase({fixture:"tiny-weather",turns:[{prompt:"Inspect"}],source_snapshots:[bad]})).toThrow();
    expect(() => validateCase({fixture:"tiny-weather",turns:[{prompt:"Inspect"}],source_snapshots:[s,s]})).toThrow("duplicate");
  } finally { rmSync(root, {recursive:true,force:true}); }
});
