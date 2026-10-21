#!/usr/bin/env node
// 版本号发布脚本（SemVer + git tag + CHANGELOG 自动化）
// 用法:
//   npm run release -- patch        # 0.1.0 -> 0.1.1
//   npm run release -- minor        # 0.1.0 -> 0.2.0
//   npm run release -- major        # 0.1.0 -> 1.0.0
//   npm run release -- 1.2.3        # 指定精确版本
//   npm run release -- patch --dry  # 只演示，不写入/提交/打标签/推送
//   npm run release -- minor --yes  # 跳过交互确认（CI/自动化场景）
//
// 流程: 校验工作区干净 -> 升 package.json 版本 -> 将 CHANGELOG [Unreleased]
//       内容转为新版本小节 -> git commit -> git tag vX.Y.Z -> push 分支与标签
//
// 约定: 日常开发时把变更写在 CHANGELOG.md 的 [Unreleased] 小节下，
//       发布时脚本会自动把这部分内容归入新版本。

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = resolve(root, 'package.json');
const changelogPath = resolve(root, 'CHANGELOG.md');

const run = (cmd) =>
  execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] })
    .toString()
    .trim();

const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};

// ---- 参数解析 ----
const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry');
const assumeYes = argv.includes('--yes');
const kind = argv.find((a) => !a.startsWith('--')) || 'patch';

if (!/^(major|minor|patch|\d+\.\d+\.\d+)$/.test(kind)) {
  fail(`无效参数 "${kind}"，应为 major | minor | patch | x.y.z`);
}

// ---- 前置校验 ----
if (run('git status --porcelain')) {
  fail('工作区存在未提交变更，请先提交或暂存后再发布。');
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const current = pkg.version;
if (!/^\d+\.\d+\.\d+$/.test(current)) {
  fail(`package.json 当前版本 "${current}" 不符合 SemVer (x.y.z)`);
}

const next = (() => {
  if (/^\d+\.\d+\.\d+$/.test(kind)) return kind;
  const [M, m, p] = current.split('.').map(Number);
  if (kind === 'major') return `${M + 1}.0.0`;
  if (kind === 'minor') return `${M}.${m + 1}.0`;
  return `${M}.${m}.${p + 1}`;
})();

if (next === current) fail(`版本 ${current} 未变化，请指定其他版本`);
if (run('git tag -l').split('\n').includes(`v${next}`)) {
  fail(`标签 v${next} 已存在，请勿重复发布`);
}

// ---- 解析 CHANGELOG [Unreleased] ----
let log = readFileSync(changelogPath, 'utf8');
const unreleasedHeader = '## [Unreleased]';
const unreleasedIdx = log.indexOf(unreleasedHeader);
if (unreleasedIdx === -1) fail('CHANGELOG.md 缺少 [Unreleased] 小节');

const bodyStart = unreleasedIdx + unreleasedHeader.length;
const nextVersionIdx = log.indexOf('\n## [', bodyStart);
const insertAt = nextVersionIdx === -1 ? log.length : nextVersionIdx + 1;

// 提取 Unreleased 正文，去掉占位说明行（_..._）、链接定义行（[x]: url）与空行
const unreleasedBody = log
  .slice(bodyStart, insertAt)
  .split('\n')
  .filter(
    (line) =>
      line.trim() !== '' &&
      !/^\s*_.*_\s*$/.test(line) &&
      !/^\s*\[[^\]]+\]:\s/.test(line)
  )
  .join('\n')
  .trim();

const date = new Date().toISOString().slice(0, 10);
const releaseNotes =
  unreleasedBody || '### Changed\n\n- 版本号发布 v{VERSION}。';
const newSection = `## [${next}] - ${date}\n\n${releaseNotes.replaceAll('{VERSION}', next)}\n\n`;

// ---- 预览与确认 ----
const branch = run('git branch --show-current');
console.log(`\n版本: v${current} -> v${next}  (${kind})`);
console.log(`分支: ${branch}   提交: chore(release): v${next}   标签: v${next}`);
console.log(`\n发布内容:\n${releaseNotes.replaceAll('{VERSION}', next)}`);
if (dryRun) {
  console.log('\n[dry-run] 未做任何修改。');
  process.exit(0);
}

if (!assumeYes) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question('\n确认发布? [y/N] ');
  rl.close();
  if (!/^y(es)?$/i.test(answer.trim())) {
    console.log('已取消。');
    process.exit(0);
  }
}

// ---- 更新 package.json ----
pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// ---- 重组 CHANGELOG：Unreleased 重置为占位，原内容归入新版本 ----
const placeholder = '\n\n_尚未发布的变更请记录在此小节。_\n\n';
log =
  log.slice(0, bodyStart) +
  placeholder +
  newSection +
  log.slice(insertAt);

// 更新链接引用: Unreleased 对比链接指向新标签, 新标签补充 release 链接
const repoUrl = run('git remote get-url origin')
  .replace(/\.git$/, '')
  .replace(/^git@github.com:/, 'https://github.com/');
log = log.replace(
  /^\[Unreleased\]: .*$/m,
  `[Unreleased]: ${repoUrl}/compare/v${next}...HEAD`
);
if (!log.includes(`[${next}]:`)) {
  log = log.trimEnd() + `\n[${next}]: ${repoUrl}/releases/tag/v${next}\n`;
}
writeFileSync(changelogPath, log);

// ---- 提交、打标签、推送 ----
run('git add package.json CHANGELOG.md');
run(`git commit -m "chore(release): v${next}"`);
run(`git tag -a v${next} -m "release v${next}"`);
run(`git push origin ${branch}`);
run(`git push origin v${next}`);

console.log(`\n✓ 已发布 v${next}: 提交、标签已推送至 origin/${branch}`);
