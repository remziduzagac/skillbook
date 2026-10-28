export type CallKind = "agent" | "judge" | "simulated_user" | "retry";
export const PILOT_CAPS = { agent: 108, judge: 300, simulated_user: 0, retry: 0 };
export class CallLimits {
  counts = { agent: 0, judge: 0, simulated_user: 0, retry: 0 };
  known = 0;
  unknown = 0;
  constructor(readonly caps = PILOT_CAPS, readonly spend = 5) {}
  dispatch(kind: CallKind) {
    if (this.known >= this.spend || this.counts[kind] >= this.caps[kind]) throw Error(`call cap reached: ${kind}`);
    this.counts[kind]++;
  }
  account(amount: number | null) { if (amount === null) this.unknown++; else this.known += amount; }
}
