import { execSync } from "node:child_process";
import { join } from "node:path";

const isWin = process.platform === "win32";
const backendPath = join(import.meta.dirname, "..", "apps", "backend");

const command = process.argv.slice(2).join(" ");

const activate = isWin
	? `cd "${backendPath}" && .venv\\Scripts\\activate && ${command}`
	: `cd "${backendPath}" && . .venv/bin/activate && ${command}`;

execSync(activate, { stdio: "inherit", shell: true });
