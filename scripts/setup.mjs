import { execSync } from "node:child_process";
import { join } from "node:path";

const backendPath = join(import.meta.dirname, "..", "apps", "backend");

execSync("python3 -m venv .venv", { cwd: backendPath, stdio: "inherit" });
execSync(".venv/bin/pip install -r requirements.txt", {
  cwd: backendPath,
  stdio: "inherit",
  shell: true,
});