import { existsSync } from "node:fs";
import { ownLogin } from "./files";
import type { Agent } from "./types";
export function loginProblem(agent: Agent, login: boolean): string | null {
  if (!Bun.which(agent)) return `${agent} is not installed`;
  if (login) return existsSync(ownLogin(agent)) ? null : `no login found at ${ownLogin(agent)}`;
  const keys = agent === "claude" ? ["ANTHROPIC_API_KEY"] : ["CODEX_API_KEY", "OPENAI_API_KEY"];
  return keys.some((k) => process.env[k]) ? null : `no API key (${keys.join(" or ")}); set one, or pass --login`;
}
export function agentCommand(
  agent: Agent,
  model: string,
  prompt: string,
  remaining: number,
  session?: string,
): string[] {
  if (agent === "claude")
    return [
      "claude",
      "-p",
      prompt,
      "--model",
      model,
      "--output-format",
      "stream-json",
      "--verbose",
      "--permission-mode",
      "acceptEdits",
      "--strict-mcp-config",
      "--max-budget-usd",
      remaining.toFixed(8),
      ...(session ? ["--resume", session] : []),
    ];
  return [
    "codex",
    "exec",
    ...(session ? ["resume"] : []),
    "--json",
    "--skip-git-repo-check",
    "-m",
    model,
    ...(session ? ["-c", 'sandbox_mode="workspace-write"'] : ["-s", "workspace-write"]),
    ...(session ? [session] : []),
    prompt,
  ];
}
