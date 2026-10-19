# Changelog

本项目所有值得关注的版本变更都会记录在此文件中。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（`主版本.次版本.修订号`）。

版本管理约定：

- `package.json` 中的 `version` 字段是唯一版本来源。
- 每次发布通过 `npm run release -- <patch|minor|major|x.y.z>` 自动完成：升版本 → 更新本文件 → 提交 → 打 `vX.Y.Z` 标签 → 推送。
- 标签命名统一为 `v` 前缀，例如 `v0.1.0`。

## [Unreleased]

_尚未发布的变更请记录在此小节。_

## [0.1.0] - 2026-10-19

### Added

- Marsket 模拟市场演示应用（React + Vite）。
- 建立版本号管理机制：CHANGELOG、`scripts/release.mjs` 发布脚本与 git 标签规范。

[Unreleased]: https://github.com/rickysvp/marsket/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rickysvp/marsket/releases/tag/v0.1.0
