export type Agent = "claude" | "codex";
export type Deadline = number | "first change" | "answer";
export interface SkillNeed { skill: string; deadline: Deadline }
export interface ConditionalNeed extends SkillNeed {
  path: string;
  taken_when?: Checks;
}
export interface Chapter {
  number: number;
  start_turn: number;
  checkpoint: { fixture: string; overlays?: string[]; remove?: string[] };
}
export interface Checks {
  reads?: string[];
  reads_not?: string[];
  no_changes?: boolean;
  changed?: string[];
  unchanged?: string[];
  removed?: string[];
  absent?: string[];
  only_changed?: string[];
  file_contains?: Record<string, string[]>;
  shorter?: string[];
  words_under?: Record<string, number>;
  only_replacement?: Record<string, { from: string; to: string }>;
  unchanged_under?: string[];
  index_links?: Record<string, string | {folder: string; contains?: string[]}>;
  keeps_lines?: string[];
  states_before_change?: boolean | string[];
  answer_contains?: string[];
  answer_not_contains?: string[];
  names_no_skill?: boolean;
  written_under?: Record<string, number>;
  folder_lacks?: Record<string, string[]>;
  folder_contains?: Record<string, string[]>;
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
  source_check?: string;
  id: string;
  tag: string;
  criterion: string;
  depends_on?: { turn: number; check: string };
}
export interface Turn {
  timeout?: number;
  skill_needs?: SkillNeed[];
  also_called?: SkillNeed[];
  if_taken?: ConditionalNeed[];
  rule_marks?: { id: string; applies: boolean; deadline: number | "first change" | "answer"; near_miss?: boolean; missing_piece?: string }[];
  judge_files?: string[];
  prompt: string;
  purpose?: string;
  fresh_session?: boolean;
  checks?: Checks;
  tagged_checks?: TaggedCheck[];
  rubric?: Rubric[];
}
export interface CaseFile {
  about?: string;
  goal?: string;
  suite?: "short" | "master";
  design?: string;
  source?: string;
  source_snapshots?: { path: string; sha256: string; text: string }[];
  fixture: string;
  chapters?: Chapter[];
  gitignore?: string[];
  agents?: Agent[];
  models?: Partial<Record<Agent, string[]>>;
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
  condition?: "installed" | "no-skill";
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
  raw?: Event;
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
  paths_present?: Record<string, boolean | null>;
  left_running?: string[] | null;
  [key: string]: any;
}
export interface Options {
  no_skill?: boolean;
  chapter?: number;
  case: string;
  suite?: "short" | "master";
  user_mode?: "fixed" | "simulated";
  judge?: boolean;
  calibration?: string;
  rubric_validation?: string;
  rubric_validation_summary?: Event;
  rubric_book?: string;
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
  final_words?: number;
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
  run_checks?: TaggedResult[];
}
