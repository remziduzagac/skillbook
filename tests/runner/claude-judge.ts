import { structuredPrompt } from "./judge-protocol";
import { MARKER } from "./paths";
import { runTurn } from "./process";
import { parse_events, turn_parts, action_evidence, redact } from "./trace";
import { cost } from "./cost";
import type { StructuredCall } from "./scenario";

// A second judge on Claude, for comparison with the calibrated Sol judge; its verdicts are not validated.
// The call gets no tools and no session, so it judges only the evidence in its prompt.
export function claudeStructuredCall(model: string, work: string, env: NodeJS.ProcessEnv, timeout: number,
  groups: number[], account: (amount: number | null) => void, driver: typeof runTurn = runTurn): StructuredCall {
  return async (instruction, data) => {
    const prompt = structuredPrompt(instruction, data);
    const command = ["claude", "-p", "--model", model, "--output-format", "stream-json", "--verbose",
      "--tools", "", "--strict-mcp-config", "--setting-sources", "", "--no-session-persistence"];
    const callGroups: number[] = [], push = callGroups.push.bind(callGroups);
    callGroups.push = (...pids: number[]) => { groups.push(...pids); return push(...pids); };
    const callEnv = { ...env, [MARKER]: `${env[MARKER] ?? "judge"}-${crypto.randomUUID()}` };
    let ran: Awaited<ReturnType<typeof runTurn>>;
    try { ran = await driver(command, work, callEnv, timeout, callGroups, prompt); }
    catch (error) { account(null); throw error; }
    const events = parse_events(ran.stdout);
    account(cost("claude", model, [events]));
    if (ran.status !== 0) throw Error(`scenario model failed (exit ${ran.status ?? "timeout"}): ` +
      redact(ran.stderr || "no diagnostic output").slice(-400));
    if (action_evidence("claude", events).length) throw Error("scenario model used tools");
    const [answer] = turn_parts("claude", events);
    return JSON.parse(answer.trim().replace(/^```json\s*|\s*```$/g, ""));
  };
}
