export type Agent = "claude" | "codex";
export interface Checks {
  reads?: string[];
  reads_not?: string[];
  no_changes?: boolean;
  changed?: string[];
  unchanged?: string[];
  removed?: string[];
  only_changed?: string[];
  file_contains?: Record<string, string[]>;
  shorter?: string[];
  states_before_change?: boolean | string[];
  answer_contains?: string[];
  answer_not_contains?: string[];
  names_no_skill?: boolean;
  written_under?: Record<string, number>;
  folder_lacks?: Record<string, string[]>;
  nothing_left_running?: boolean;
  tmp_has?: string[];
  tmp_lacks?: string[];
  agent_started_or_answer?: string[];
  answer_path_has?: string[];
  actions_lack?: string[];
}
export interface TaggedCheck {
  id: string;
  tag: string;
  depends_on?: { turn: number; check: string };
  assert: Checks;
}
export interface Rubric {
  id: string;
  tag: string;
  criterion: string;
}
export interface Turn {
  prompt: string;
  purpose?: string;
  checks?: Checks;
  tagged_checks?: TaggedCheck[];
  rubric?: Rubric[];
}
export interface CaseFile {
  about?: string;
  design?: string;
  source?: string;
  fixture: string;
  agents?: Agent[];
  runs?: number;
  pointer?: boolean;
  routing_only?: boolean;
  version_control?: boolean;
  uses_skill_example?: boolean;
  skills?: string[];
  category?: "normal" | "boundary" | "edge";
  rejects?: string;
  covers?: string[];
  review?: string[];
  project_skills?: ("skillbook-design" | "skillbook-write")[];
  checks?: Checks;
  turns: Turn[];
  user?: { description: string; facts: Record<string, string>; mode: "fixed" | "simulated" };
}
export interface Case extends CaseFile {
  id: string;
  set: string;
  agents: Agent[];
  runs: number;
  pointer: boolean;
  checks: Checks;
}
export type Verdict = boolean | null | "not reached";
export interface TaggedResult {
  id?: string;
  tag: string;
  verdict: Verdict;
}
export interface JudgeRequest {
  rubric: Rubric;
  answer: string;
  evidence: unknown;
}
export interface JudgeResult extends TaggedResult {
  reason: string;
}
export type RubricJudge = (request: JudgeRequest) => Promise<JudgeResult>;
// External agent events are untrusted records with different shapes for each harness.
export type Event = Record<string, any>;
export interface Observation {
  reads: string[];
  changes: string[];
  answer: string;
  targets: string[];
  agents_started: number;
  agents_unseen: boolean;
  before_change: string;
  changed_files: boolean;
  sequencing_unknown: string;
  files: Record<string, string | null>;
  left_running?: string[] | null;
  [key: string]: any;
}
export interface Options {
  case: string;
  agents: Agent[];
  runs: number;
  model: string[];
  login: boolean;
  instruction: string;
  budget: number;
  jobs: number;
  timeout: number;
  keep: boolean;
  out?: string;
  dry_run: boolean;
  coverage: boolean;
  summary: boolean;
  yes: boolean;
  validate: boolean;
  to_judge: string[];
}

export interface TurnResult extends Observation {
  scripted_message: string;
  sent_message: string;
  purpose: string;
  final_answer: string;
  between_tools: string[];
  actions: Event[];
  file_diffs: Record<string, string>;
  trace_complete: boolean;
  tagged_checks: TaggedResult[];
  rubric_pending: Rubric[];
  judgments?: JudgeResult[];
}
export interface RunResult {
  case: string;
  agent: Agent;
  model: string;
  run: number;
  error: string | null;
  cost: number | null;
  cost_unknown: boolean;
  checks: Record<string, Verdict>;
  reads: string[];
  changes: string[];
  answer: string;
  review: string[];
  turns: TurnResult[];
  routing_only: boolean;
}
