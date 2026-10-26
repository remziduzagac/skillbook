export function judgeTimeout(value: string = "600"): number {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) throw Error("--judge-timeout needs positive seconds");
  return seconds;
}
