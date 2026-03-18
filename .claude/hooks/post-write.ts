import { spawnSync } from 'child_process';

(async () => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  const input = JSON.parse(Buffer.concat(chunks).toString());
  const file: string =
    (input.tool_input && input.tool_input.file_path) ||
    (input.tool_response && input.tool_response.filePath) ||
    '';

  if (/\.tsx?$/.test(file)) {
    spawnSync('npx', ['prettier', '--write', file], { stdio: 'inherit', shell: true });
    spawnSync('npx', ['eslint', '--fix', file], { stdio: 'inherit', shell: true });
    spawnSync('npx', ['tsc', '--noEmit'], { stdio: 'inherit', shell: true });
  }
})();
