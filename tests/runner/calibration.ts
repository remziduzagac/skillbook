import { readFileSync } from "node:fs";
import type { JudgeResult } from "./types";

export interface CalibrationSample {
  id: string;
  answer: string;
  human: boolean | null;
  judgment?: JudgeResult;
}
export function calibrationReport(samples: CalibrationSample[]) {
  const rated = samples.filter(s => typeof s.human === "boolean" && typeof s.judgment?.verdict === "boolean");
  return {
    complete: samples.length >= 3 && rated.length === samples.length,
    total: samples.length,
    compared: rated.length,
    disagreements: rated.filter(s => s.human !== s.judgment!.verdict).map(s => ({
      id: s.id, human: s.human, judge: s.judgment!.verdict, reason: s.judgment!.reason,
    })),
  };
}
export function requireCalibration(path?: string) {
  if (!path) throw Error("--judge needs --calibration FILE with completed human/model calibration");
  const data = JSON.parse(readFileSync(path, "utf8"));
  if (data.valid_for_scoring === false) throw Error("calibration context was marked invalid");
  if (data.model !== "gpt-6.1-sol" || !Array.isArray(data.samples) || !calibrationReport(data.samples).complete)
    throw Error("calibration is incomplete or uses the wrong model");
  return calibrationReport(data.samples);
}
