import { score } from "./scoring";
import { currentFinal } from "./answers";
import { readFileSync } from "node:fs";
import { rubricBatch } from "./scenario";
import type { StructuredCall } from "./scenario";
import type { JudgeResult, Rubric } from "./types";

export interface CalibrationSample {
  id: string;
  set?: "tuning" | "heldout";
  answer: string;
  human?: boolean | null;
  human_reason?: string;
  prompt?: string;
  criterion?: Rubric;
  evidence?: unknown;
  reference?: Record<string, string | number>;
  skip?: string;
  judgment?: JudgeResult;
}
export function agreement(agreed: number, total: number) {
  const rows = Array.from({ length: total }, (_, i) => ({ id: String(i), tag: "agreement", verdict: i < agreed }));
  const result = score(rows).agreement;
  return { agreed, total, rate: result?.rate ?? null, interval: result?.interval ?? [0, 1] };
}
export function selfAgreement(samples: CalibrationSample[], previous: CalibrationSample[]) {
  const old = new Map(previous.map(s => [s.id, s]));
  const pairs = samples.filter(s => !s.skip && typeof s.human === "boolean");
  let agreed = 0, compared = 0;
  for (const row of pairs) {
    const prior = old.get(row.id);
    if (!prior) continue;
    const frozen = (s: CalibrationSample) => JSON.stringify([s.set ?? "tuning", s.prompt, s.criterion, s.answer, s.evidence, s.human]);
    if (frozen(row) !== frozen(prior)) throw Error("self-agreement needs identical evidence and ratings: " + row.id);
    if (typeof row.judgment?.verdict === "boolean" && typeof prior.judgment?.verdict === "boolean") {
      compared++; agreed += Number(row.judgment.verdict === prior.judgment.verdict);
    }
  }
  return { ...agreement(agreed, compared), eligible: pairs.length, compared, unresolved: pairs.length - compared };
}
export function calibrationReport(samples: CalibrationSample[], previous?: CalibrationSample[]) {
  const result = reportItems(samples);
  return { ...result, by_set: Object.fromEntries((["tuning", "heldout"] as const).map(set => {
    const rows = samples.filter(s => (s.set ?? "tuning") === set);
    return [set, { ...reportItems(rows), self_agreement: previous ? selfAgreement(rows,
      previous.filter(s => (s.set ?? "tuning") === set)) : null }];
  })) };
}
function reportItems(samples: CalibrationSample[]) {
  const skipped = samples.filter(s => s.skip);
  const rated = samples.filter(s => !s.skip && typeof s.human === "boolean");
  const compared = rated.filter(s => typeof s.judgment?.verdict === "boolean");
  const agreed = compared.filter(s => s.human === s.judgment!.verdict);
  const split = (human: boolean) => ({
    rated: rated.filter(s => s.human === human).length,
    ...agreement(agreed.filter(s => s.human === human).length, rated.filter(s => s.human === human).length),
  });
  const pending = samples.length - rated.length - skipped.length;
  return {
    complete: rated.length >= 3 && pending === 0 && compared.length === rated.length,
    total: samples.length,
    rated: rated.length,
    skipped: skipped.length,
    pending_human: pending,
    judged: rated.filter(s => s.judgment).length,
    pending_judge: rated.filter(s => !s.judgment).length,
    unresolved: rated.filter(s => s.judgment && typeof s.judgment.verdict !== "boolean").length,
    compared: compared.length,
    agreed: agreed.length,
    by_human: { pass: split(true), fail: split(false) },
    disagreements: rated.filter(s => s.judgment && s.human !== s.judgment.verdict).map(s => ({
      id: s.id, human: s.human, judge: s.judgment!.verdict,
      human_reason: s.human_reason ?? "", reason: s.judgment!.reason,
    })),
  };
}
export function calibrationItems(source: {
  prompt?: string; criterion?: string; samples: CalibrationSample[];
}): CalibrationSample[] {
  const seen = new Set<string>();
  return source.samples.map(sample => {
    const human = sample.human ?? null;
    if (!sample.id.trim() || seen.has(sample.id) || ![true, false, null].includes(human))
      throw Error("calibration items need unique ids and human verdicts");
    seen.add(sample.id);
    const { judgment: _previous, ...item } = sample;
    item.human = human;
    item.set ??= "tuning";
    if (!["tuning", "heldout"].includes(item.set)) throw Error("invalid calibration set");
    if (item.skip && item.human !== null) throw Error("a skipped calibration item cannot have a verdict");
    if (item.skip) return item;
    const prompt = item.prompt ?? source.prompt;
    const criterion = item.criterion ?? (source.criterion ? {
      id: item.id, tag: "skill:devise-design", criterion: source.criterion,
    } : undefined);
    if (!prompt?.trim() || !criterion?.criterion.trim() || !criterion.id.trim() || !criterion.tag.trim())
      throw Error("calibration items need a prompt and criterion");
    return { ...item, answer: currentFinal(item.answer, item.evidence), prompt, criterion,
      evidence: item.evidence ?? { prompt } };
  });
}
export async function calibrateItems(
  call: StructuredCall, samples: CalibrationSample[], jobs = 2, checkpoint: () => void = () => {},
) {
  if (!Number.isInteger(jobs) || jobs < 1) throw Error("invalid calibration job count");
  const grouped = new Map<string, CalibrationSample[]>();
  for (const sample of samples) {
    if (sample.skip) continue;
    if (!sample.criterion || !sample.prompt) throw Error("normalize calibration items before judging");
    const key = JSON.stringify([sample.prompt, sample.answer, sample.evidence]);
    const group = grouped.get(key) ?? [];
    if (group.some(s => s.criterion!.id === sample.criterion!.id))
      throw Error("duplicate criterion for the same calibration evidence");
    group.push(sample); grouped.set(key, group);
  }
  const groups = [...grouped.values()];
  let next = 0;
  async function worker() {
    while (next < groups.length) {
      const group = groups[next++]!;
      try {
        const judged = await rubricBatch(call, group.map(s => ({
          rubric: s.criterion!, answer: s.answer, evidence: s.evidence,
        })));
        for (const sample of group) sample.judgment = judged.find(r => r.id === sample.criterion!.id)!;
      } catch (error) {
        for (const sample of group) sample.judgment = {
          id: sample.criterion!.id, tag: sample.criterion!.tag, verdict: null, reason: String(error),
        };
      }
      checkpoint();
    }
  }
  await Promise.all(Array.from({ length: Math.min(jobs, groups.length) }, worker));
  return calibrationReport(samples);
}
export function requireCalibration(path?: string) {
  if (!path) throw Error("--judge needs --calibration FILE with completed human/model calibration");
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (data.valid_for_scoring === false) throw Error("calibration context was marked invalid");
  if (data.model !== "gpt-6.1-sol" || !Array.isArray(data.samples) || !calibrationReport(data.samples).complete)
    throw Error("calibration is incomplete or uses the wrong model");
  return calibrationReport(data.samples);
}

export function authorizeCalibration(source: { samples: CalibrationSample[]; heldout_runs?: string[] }, heldout: boolean, now = new Date().toISOString()) {
  if (!source.samples.some(s => s.set === "heldout")) return source;
  if (!heldout) throw Error("held-out calibration requires --heldout; no calls started");
  return { ...source, heldout_runs: [...(source.heldout_runs ?? []), now] };
}
