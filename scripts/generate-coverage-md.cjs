/**
 * Generates TEST_COVERAGE.md from Vitest coverage-summary.json.
 * Run after: npm run test:coverage (Vitest must use json-summary reporter).
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const summaryPath = path.join(rootDir, 'coverage', 'coverage-summary.json');
const outputPath = path.join(rootDir, 'TEST_COVERAGE.md');

if (!fs.existsSync(summaryPath)) {
  console.error('coverage/coverage-summary.json not found. Run: npm run test:coverage');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

function pct(obj) {
  return obj?.pct != null ? `${obj.pct.toFixed(2)}%` : 'N/A';
}
function coveredTotal(obj) {
  return obj ? `${obj.covered} / ${obj.total}` : 'N/A';
}

const metrics = [
  total.statements?.pct,
  total.branches?.pct,
  total.functions?.pct,
  total.lines?.pct,
].filter((n) => typeof n === 'number');
const overallPct =
  metrics.length > 0 ? (metrics.reduce((a, b) => a + b, 0) / metrics.length).toFixed(2) : 'N/A';

const lines = [
  '# Test Coverage Report',
  '',
  '**Auto-generated when running:** `npm run test:coverage`',
  '',
  '## Overall coverage',
  '',
  `**${overallPct === 'N/A' ? 'N/A' : `${overallPct}%`}** (average of statements, branches, functions, lines)`,
  '',
  '| Statements | Branches | Functions | Lines |',
  '|------------|----------|-----------|-------|',
  `| ${pct(total.statements)} | ${pct(total.branches)} | ${pct(total.functions)} | ${pct(total.lines)} |`,
  '',
  '## Summary (covered / total)',
  '',
  '| Metric      | Coverage | Covered / Total |',
  '|------------|----------|-----------------|',
  `| Statements | ${pct(total.statements)}    | ${coveredTotal(total.statements)}        |`,
  `| Branches   | ${pct(total.branches)}    | ${coveredTotal(total.branches)}        |`,
  `| Functions  | ${pct(total.functions)}   | ${coveredTotal(total.functions)}         |`,
  `| Lines      | ${pct(total.lines)}   | ${coveredTotal(total.lines)}        |`,
  '',
  '## Coverage by file',
  '',
  '| File | Statements | Branches | Functions | Lines |',
  '|------|------------|----------|-----------|-------|',
];

const fileEntries = Object.entries(summary).filter(([key]) => key !== 'total');
fileEntries.sort(([a], [b]) => a.localeCompare(b));

for (const [filePath, data] of fileEntries) {
  const shortPath = path.relative(rootDir, path.resolve(filePath)).replace(/\\/g, '/') || filePath;
  lines.push(
    `| ${shortPath} | ${pct(data.statements)} | ${pct(data.branches)} | ${pct(data.functions)} | ${pct(data.lines)} |`,
  );
}

lines.push(
  '',
  '---',
  '',
  'To regenerate: run `npm run test:coverage`. An HTML report is in `coverage/index.html`.',
);

fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log('Written:', outputPath);
