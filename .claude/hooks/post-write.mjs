// PostToolUse hook (Write|Edit): format + lint-fix the edited file, then type-check the project.
// Runs the project's own Prettier / ESLint / TypeScript directly through node (no npx, no shell).
// Exit code 2 sends stderr back to Claude so it can fix remaining problems.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
const file = input.tool_input?.file_path || input.tool_response?.filePath || '';
const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

if (!/\.(ts|tsx)$/.test(file)) process.exit(0);

const binPath = (pkg, bin) => join(cwd, 'node_modules', pkg, 'bin', bin);
const run = (script, args) =>
  spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });

const problems = [];
const collect = (label, result) => {
  if (result.status !== 0) {
    problems.push(`${label} failed:\n${result.stdout}${result.stderr}`.trim());
  }
};

collect('Prettier', run(binPath('prettier', 'prettier.cjs'), ['--write', file]));
collect('ESLint', run(binPath('eslint', 'eslint.js'), ['--fix', file]));
collect('TypeScript', run(binPath('typescript', 'tsc'), ['--noEmit']));

if (problems.length > 0) {
  console.error(problems.join('\n\n'));
  process.exit(2);
}
