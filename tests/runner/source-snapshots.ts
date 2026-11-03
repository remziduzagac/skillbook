import { readFileSync, lstatSync } from "node:fs";
import { inside } from "./chapters";
import type { CaseFile } from "./types";

// Binary source text is authored alongside the case and usable only for these exact bytes.
export function sourceSnapshots(work: string, sources: Record<string, string>, snapshots: CaseFile["source_snapshots"], strict = false) {
  const result = {...sources};
  for (const snapshot of snapshots ?? []) {
    if (!(snapshot.path in sources)) continue;
    const full = inside(work, snapshot.path);
    const digest = lstatSync(full).isFile() ? new Bun.CryptoHasher("sha256").update(readFileSync(full)).digest("hex") : null;
    if (digest !== snapshot.sha256) {
      if (strict) throw Error("source snapshot hash mismatch: " + snapshot.path);
      result[snapshot.path] = "(content withheld: source snapshot hash mismatch)";
    } else result[snapshot.path] = snapshot.text;
  }
  return result;
}
