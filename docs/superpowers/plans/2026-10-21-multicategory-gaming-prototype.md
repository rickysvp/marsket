# 多品类互动平台原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `reference-platform-prototype/` 建立独立、高保真、可点击的多品类网页原型，覆盖已调研的全部主入口与代表性深层路径。

**Architecture:** 单独 React/Vite 应用；URL 路由、样本数据、选择单状态、媒体面板各有独立模块。目录与详情复用结构化数据，真实游戏和直播以明确的演示承载页表示。现有 `marsket-demo` 保持原样。

**Tech Stack:** React 19、Vite 5、CSS、Vitest 2；复用工作区已安装依赖，不引入远程 UI 框架。浏览器视觉与流程检查按 @playwright / @superpowers:verification-before-completion 执行。

---

## 文件结构

- `reference-platform-prototype/package.json`, `index.html`, `vite.config.js`：独立运行与构建。
- `src/main.jsx`, `src/App.jsx`, `src/router.js`：入口、路由解析、顶层页面选择。
- `src/data/events.js`, `src/data/games.js`：样本赛事/盘口与游戏/供应商目录。
- `src/state/slip.js`：选择单纯函数；`src/state/useSlip.js`：页面状态包装。
- `src/components/Shell.jsx`, `Sidebar.jsx`, `Topbar.jsx`, `MediaPanel.jsx`, `BetSlip.jsx`：共用框架与右栏。
- `src/pages/SportsHome.jsx`, `SportsList.jsx`, `SportEvent.jsx`, `LiveDirectory.jsx`, `EsportsPage.jsx`：体育与电竞。
- `src/pages/CasinoLobby.jsx`, `BoardLobby.jsx`, `SlotsLobby.jsx`, `JackpotPage.jsx`, `GameDetail.jsx`：娱乐与电子目录/承载页。
- `src/pages/LotteryPage.jsx`, `AccountPage.jsx`, `RecordsPage.jsx`：未验证玩法示意、账户与记录。
- `src/styles/tokens.css`, `layout.css`, `sports.css`, `games.css`, `responsive.css`：视觉系统、页面类型与响应式布局。
- `src/router.test.js`, `src/data/catalog.test.js`, `src/state/slip.test.js`：关键行为验证；`docs/qa.md`：逐页浏览验收记录。

## Task 1：独立应用与可直达路由

**Files:** Create `reference-platform-prototype/{package.json,index.html,vite.config.js,src/main.jsx,src/App.jsx,src/router.js,src/router.test.js}`.

- [ ] **Step 1:** 写 `router.test.js`，覆盖全部主入口 `/sports`、`/sports/live`、`/esports`、`/casino`、`/board`、`/lottery`、`/slots`、`/jackpots`、`/account`、`/records`，以及 `/sports/event/e1`、`/games/p1/g1`、未知路径。预期路由解析输出 `{page, params}`，未知路径落到 `not-found`。
- [ ] **Step 2:** 运行 `node ../node_modules/vitest/vitest.mjs run src/router.test.js`（从原型目录），确认因模块未存在而失败。
- [ ] **Step 3:** 实现 `resolveRoute(pathname)`，按固定路径和详情参数解析；`navigate(path)` 用 History API 发出 `popstate`，`App` 监听并渲染临时页面标签。详情规则示例：`/^\/sports\/event\/([^/]+)$/` → `{page:'sport-event',params:{id}}`；`/^\/games\/([^/]+)\/([^/]+)$/` → `{page:'game',params:{providerId,gameId}}`。
- [ ] **Step 4:** 跑路由测试与 `node ../node_modules/vite/bin/vite.js build`，确认通过；直接打开 `/sports/event/e1` 应回退到应用 HTML。
- [ ] **Step 5:** 仅提交本任务的原型文件。

## Task 2：导航外壳与视觉变量

**Files:** Create `src/components/{Shell,Sidebar,Topbar,MediaPanel}.jsx`, `src/styles/{tokens,layout,responsive}.css`; Modify `src/App.jsx`.

- [ ] **Step 1:** 建立导航配置：体育（热门、足球、篮球、网球、乒乓球、电竞体育、羽毛球、棒球、直播）、娱乐（真人、电竞、棋牌、彩票）、电子（老虎机、奖池），另设记录、我的。路由链接必须与 Task 1 一致。
- [ ] **Step 2:** 实现顶栏、可收合左栏、中央路由出口、右栏媒体/聊天；右栏可在媒体与选择单之间切换。示例画面采用原创图形/合法可用素材，不嵌参考站流媒体。
- [ ] **Step 3:** 定义间距、颜色、字体、圆角、阴影变量；在常见桌面宽度实现三栏，在窄屏把导航变抽屉、右栏变底部抽屉。
- [ ] **Step 4:** 运行构建，浏览 `/sports`、`/casino`、`/account`，核对导航高亮、收合、移动端无遮挡。
- [ ] **Step 5:** 提交外壳与样式。

## Task 3：赛事数据、首页与赛事列表

**Files:** Create `src/data/events.js`, `src/pages/{SportsHome,SportsList}.jsx`, `src/styles/sports.css`, `src/data/catalog.test.js`; Modify `src/App.jsx`.

- [ ] **Step 1:** 写目录测试：每个运动/电竞体育至少有一条赛事；事件 ID 唯一；每条赛事至少一个带 ID 的盘口和选项；搜索与阶段过滤结果可预测。
- [ ] **Step 2:** 运行目录测试确认失败；建立体育样本：足球、篮球、网球、乒乓球、羽毛球、棒球、电竞足球、电竞篮球。数据使用 `id/sport/competition/home/away/startAt/phase/score/stream/markets` 字段，赔率注明“演示”。
- [ ] **Step 3:** 实现首页推荐、滚球、精选区；列表页实现运动、联赛/滚球/即将/早盘、搜索、时段与收藏筛选，单行显示核心盘口和盘口数。筛选改变可见结果，赛事名称进入详情。
- [ ] **Step 4:** 跑目录测试与构建，浏览多运动列表、空搜索、直播标识和深层赛事链接。
- [ ] **Step 5:** 提交赛事目录和页面。

## Task 4：赛事详情与投注选择单演示

**Files:** Create `src/state/{slip.js,useSlip.js,slip.test.js}`, `src/components/BetSlip.jsx`, `src/pages/SportEvent.jsx`; Modify `src/App.jsx`, `src/styles/sports.css`.

- [ ] **Step 1:** 写选择单测试：同选项重复点击切换选中、移除选项、金额非负、单注有金额时计算示例预估回报、串场少于两条时显示不满足条件、赔率变化时标记需确认。
- [ ] **Step 2:** 运行测试确认失败；实现 `addOrToggleSelection`, `removeSelection`, `setStake`, `getSlipSummary`, `markOddsChanged` 等纯函数。数据草稿只保存在页面状态。
- [ ] **Step 3:** 赛事详情展示比分横幅、盘口标签、折叠市场和概率条；点击赔率打开右侧单注/串场选择单，支持快捷金额、数字输入、MAX 样式、移除与关闭。提供“模拟赔率更新”按钮：变动已选报价并在选择单显示重新确认提示；点击确认后更新快照。提交操作显示“仅供原型演示”，不创建订单。
- [ ] **Step 4:** 跑测试/构建，在浏览器验证列表 → 详情 → 选赔率 → 输入金额 → 模拟赔率更新 → 重新确认 → 切换串场 → 移除的流程，确认无真实交易请求。
- [ ] **Step 5:** 提交赛事详情和选择单。

## Task 5：直播与电竞赛事

**Files:** Create `src/pages/{LiveDirectory,EsportsPage}.jsx`; Modify `src/data/events.js`, `src/components/MediaPanel.jsx`, `src/styles/sports.css`.

- [ ] **Step 1:** 直播目录仅展示 `stream=true` 的赛事，并可按运动过滤；点选赛事更新右侧示例媒体与聊天空态。媒体按钮具有静音、画中画/全屏的可见状态（全屏可用浏览器 Fullscreen API）。
- [ ] **Step 2:** 电竞页提供 LOL、CS2、DOTA2、VAL 等项目与赛程标签；电竞体育为体育导航中的独立入口，包含短时制足球/篮球赛程。点击赛事可进入同一详情框架。
- [ ] **Step 3:** 跑测试/构建并验证直播筛选、电竞项目切换和返回路径；提交本任务。

## Task 6：真人、棋牌、捕鱼目录与游戏承载页

**Files:** Create `src/data/games.js`, `src/pages/{CasinoLobby,BoardLobby,GameDetail}.jsx`, `src/styles/games.css`; Extend `src/data/catalog.test.js`; Modify `src/App.jsx`.

- [ ] **Step 1:** 测试游戏目录：`providerId+gameId` 唯一，同名游戏可共存，类别/供应商/搜索过滤确定；每类有可到达的 `/games/:providerId/:gameId` 详情。
- [ ] **Step 2:** 建立真人优选/好路/百家乐/多台/龙虎/骰宝/真人秀/轮盘、棋牌捕鱼/麻将/扑克/牛牛/百人/其他的样本数据。真人桌台卡展示原创路单、桌台状态与预览；棋牌游戏卡展示封面、名称、供应商。
- [ ] **Step 3:** 目录过滤与视图切换可操作；游戏卡进入统一承载页，包含返回、全屏样式、游戏元数据、原创“演示内容”画面和更多游戏。不得请求参考站第三方启动地址。
- [ ] **Step 4:** 跑目录测试/构建；浏览真人 → 桌台、棋牌 → 捕鱼、供应商过滤、搜索无结果；提交。

## Task 7：老虎机、奖池与彩票示意

**Files:** Create `src/pages/{SlotsLobby,JackpotPage,LotteryPage}.jsx`; Extend `src/data/games.js`, `src/data/catalog.test.js`, `src/styles/games.css`; Modify `src/App.jsx`.

- [ ] **Step 1:** 老虎机页提供推荐、热门、新品、热赔率、冷赔率、最高回报与供应商过滤/搜索。RTP、波动性、中奖线、奖池分别标注，不将热赔率伪称 RTP；游戏卡通向 Task 6 承载页。
- [ ] **Step 2:** 奖池页按供应商切换并显示示例奖池汇总和游戏级数据。彩票页展示大厅、投注记录、开奖历史、规则的可点击示意标签与明确的“玩法资料待核实”状态。
- [ ] **Step 3:** 扩展数据测试以覆盖老虎机筛选和奖池关联；跑测试/构建并浏览全部标签、过滤、详情/空态；提交。

## Task 8：账户、记录与统一完成度

**Files:** Create `src/pages/{AccountPage,RecordsPage}.jsx`, `src/styles/account.css`, `docs/qa.md`; Modify `src/App.jsx`, `src/styles/responsive.css`.

- [ ] **Step 1:** 账户页展示示例余额、常用功能、钱包、广场、游戏/系统设置与帮助分组。涉及充值、提现、真实账号、卡片等入口显示演示说明，不采集信息。
- [ ] **Step 2:** 记录页有体育/游戏页签、状态与日期过滤、示例空态；体育含提前结算、现场、未结、已结、取消，游戏含全部/未结/已结。
- [ ] **Step 3:** 完成所有按钮的可见反馈、404、加载/空/不可用状态；逐项浏览九类主入口及代表路径，记录 URL、结果、移动端观察到 `docs/qa.md`。
- [ ] **Step 4:** 跑 `node ../node_modules/vitest/vitest.mjs run` 与 `node ../node_modules/vite/bin/vite.js build`，完成浏览器视觉检查和修复；提交。

## Task 9：最终核对与交付

**Files:** Modify `docs/qa.md` and any confirmed defects only.

- [ ] **Step 1:** 按设计规格逐项核对九类主入口、深层导航、体育选择单、过滤搜索、独立项目边界、响应式与示例数据标识。
- [ ] **Step 2:** 查验 `git status` 与提交范围，确认现有 `marsket-demo` 的未提交文件未被原型任务修改；重新运行所有相关测试与构建。
- [ ] **Step 3:** 启动本地开发预览，分别直接刷新一个赛事详情 URL 和一个游戏详情 URL，再在 Codex 中打开可点击原型；给用户交付入口、范围与尚待真实资料的部分。
