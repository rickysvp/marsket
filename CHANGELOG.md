# Changelog

本项目所有值得关注的版本变更都会记录在此文件中。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（`主版本.次版本.修订号`）。

版本管理约定：

- `package.json` 中的 `version` 字段是唯一版本来源。
- 日常开发把变更写在本文件的 `[Unreleased]` 小节。
- 每次发布通过 `npm run release -- <patch|minor|major|x.y.z>` 自动完成：
  升版本 → 将 `[Unreleased]` 内容归入新版本 → 提交 → 打 `vX.Y.Z` 标签 → 推送。
- 标签命名统一为 `v` 前缀，例如 `v0.1.0`。
- 版本升降规则：
  - `patch`：向后兼容的问题修复；
  - `minor`：向后兼容的功能新增；
  - `major`：不兼容的破坏性变更（1.0.0 之前 minor 也可承载较大重构）。

## [Unreleased]

_尚未发布的变更请记录在此小节。_

## [0.2.0] - 2026-10-21

### Added
- 多品类互动原型：
  - 体育：体育首页、七种体育项目列表、直播目录、赛事详情、演示选择单；
  - 电竞：电竞项目赛程页；
  - 游戏：真人桌台、棋牌与捕鱼、老虎机、奖池、彩票栏目与游戏承载页；
  - 账户页与记录页。
- 前端路由体系（`src/router.js`）、页面层（`src/pages`）、投注单状态管理
  （`src/state`）、演示数据层（`src/data`）与设计令牌、分品类样式（`src/styles`）。
- 页面外壳组件：`Shell`、`Sidebar`、`Topbar`、`MediaPanel`、`BetSlip`。
- 参考站核实记录 `docs/qa.md` 与原型预览图 `docs/preview.png`。
### Changed
- 由单页 QuickGames 演示重构为多品类页面结构，源码统一到仓库根目录。
- 恢复并增强版本发布脚本 `scripts/release.mjs`：发布时自动将
  `[Unreleased]` 内容归入新版本，支持 `--dry` 与 `--yes` 参数。
### Removed
- 旧的单页 QuickGames / mockData / simulationStore 演示代码。
- `reference-platform-prototype` 子目录（内容已上移至根目录）。

## [0.1.1] - 2026-10-19

### Changed

- 版本号发布 v0.1.1。

## [0.1.0] - 2026-10-19

### Added

- Marsket 模拟市场演示应用（React + Vite）。
- 建立版本号管理机制：CHANGELOG、`scripts/release.mjs` 发布脚本与 git 标签规范。

[Unreleased]: https://github.com/rickysvp/marsket/compare/v0.2.0...HEAD
[0.1.1]: https://github.com/rickysvp/marsket/releases/tag/v0.1.1
[0.1.0]: https://github.com/rickysvp/marsket/releases/tag/v0.1.0
[0.2.0]: https://github.com/rickysvp/marsket/releases/tag/v0.2.0
