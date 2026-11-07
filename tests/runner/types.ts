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
export interface Rubric {
  id: string;
  tag: string;
  criterion: string;
}
export interface Turn {
  timeout?: number;
  prompt: string;
  fresh_session?: boolean;
  checks?: Checks;
  rubric?: Rubric[];
}
export interface CaseFile {
  about?: string;
  goal?: string;
  fixture: string;
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
  review?: string[];
  project_skills?: ("skillbook-guide-design" | "skillbook-guide-write" | "skillbook-test-write")[];
  checks?: Checks;
  turns: Turn[];
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
export type Verdict = boolean | null;
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
  no_skill?: boolean;
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
  yes: boolean;
  validate: boolean;
  to_judge: string[];
}

export interface TurnResult extends Observation {
  scripted_message: string;
  sent_message: string;
  final_answer: string;
  final_words?: number;
  between_tools: string[];
  actions: Event[];
  file_diffs: Record<string, string>;
  trace_complete: boolean;
  rubric_pending: Rubric[];
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
