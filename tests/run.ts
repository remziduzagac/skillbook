import { main } from "./runner/cli";
try {
  process.exitCode = await main();
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
}
