export const categories = [
  { id: 'all', label: '全部市场', count: 17 },
  { id: 'crypto', label: '加密货币', count: 3 },
  { id: 'stocks', label: '美股市场', count: 4 },
  { id: 'sports', label: '体育赛事', count: 3 },
  { id: 'esports', label: '电子竞技', count: 2 },
  { id: 'tech', label: '科技趋势', count: 2 },
  { id: 'macro', label: '宏观经济', count: 1 },
]

export const markets = [
  {
    id: 'btc-150k', category: 'crypto', categoryLabel: '加密货币', eyebrow: '涨跌预测 / BTC', kind: 'prediction',
    title: '比特币会在 2026 年底前触及 $150,000 吗？', subtitle: '以 Coinbase BTC-USD 现货指数为准',
    yes: 63, change: 4.8, volume: '¥ 2,480 万', end: '2026.12.31', source: 'ORACLE / COINBASE', hot: true,
    spark: [42, 45, 44, 49, 47, 52, 54, 51, 58, 63],
  },
  {
    id: 'btc-weekly', category: 'crypto', categoryLabel: '加密货币', eyebrow: '涨跌预测 / BTC', kind: 'prediction',
    title: 'BTC 本周收盘价会高于 $118,000 吗？', subtitle: '以 BTC/USD 周五 16:00 UTC 价格为准',
    yes: 57, change: 2.9, volume: '¥ 1,680 万', end: '2026.10.23', source: 'DATA / BTC-USD', hot: false,
    spark: [42, 45, 44, 49, 47, 52, 51, 54, 56, 57],
  },
  {
    id: 'eth-4k', category: 'crypto', categoryLabel: '加密货币', eyebrow: '涨跌预测 / ETH', kind: 'prediction',
    title: 'ETH 在 11 月前会重新站上 $4,000 吗？', subtitle: '以主流现货指数综合价格为准',
    yes: 44, change: -1.8, volume: '¥ 920 万', end: '2026.11.01', source: 'DATA / ETH-USD', hot: false,
    spark: [50, 48, 49, 46, 48, 45, 47, 44, 46, 44],
  },
  {
    id: 'aapl-stock', category: 'stocks', categoryLabel: '美股虚拟股', eyebrow: '虚拟股票 / AAPL', kind: 'stock', symbol: 'AAPL',
    title: 'Apple Inc.（AAPL）虚拟股票', subtitle: '跟踪 AAPL 实时价格变化的模拟持仓产品', price: 210.35, change: 1.62, volume: '¥ 1,240 万', end: '持续交易', source: 'QUOTE / NASDAQ', hot: true,
    spark: [192, 195, 198, 196, 201, 203, 200, 205, 208, 210.35],
  },
  {
    id: 'nvda-stock', category: 'stocks', categoryLabel: '美股虚拟股', eyebrow: '虚拟股票 / NVDA', kind: 'stock', symbol: 'NVDA',
    title: 'NVIDIA Corp.（NVDA）虚拟股票', subtitle: '跟踪 NVDA 实时价格变化的模拟持仓产品', price: 184.72, change: -0.84, volume: '¥ 980 万', end: '持续交易', source: 'QUOTE / NASDAQ', hot: false,
    spark: [190, 188, 192, 187, 189, 186, 188, 185, 186, 184.72],
  },
  {
    id: 'tsla-stock', category: 'stocks', categoryLabel: '美股虚拟股', eyebrow: '虚拟股票 / TSLA', kind: 'stock', symbol: 'TSLA',
    title: 'Tesla Inc.（TSLA）虚拟股票', subtitle: '跟踪 TSLA 实时价格变化的模拟持仓产品', price: 342.18, change: 3.45, volume: '¥ 760 万', end: '持续交易', source: 'QUOTE / NASDAQ', hot: false,
    spark: [316, 320, 318, 325, 323, 330, 335, 331, 339, 342.18],
  },
  {
    id: 'aapl-direction', category: 'stocks', categoryLabel: '美股市场', eyebrow: '涨跌预测 / AAPL', kind: 'prediction', symbol: 'AAPL',
    title: 'AAPL 下周收盘价会高于本周收盘价吗？', subtitle: '以 NASDAQ 官方收盘价为准',
    yes: 61, change: 4.2, volume: '¥ 460 万', end: '2026.10.23', source: 'DATA / NASDAQ', hot: false,
    spark: [49, 52, 50, 55, 53, 56, 58, 57, 60, 61],
  },
  {
    id: 'nba-finals', category: 'sports', categoryLabel: '体育赛事', eyebrow: '比赛预测 / NBA', kind: 'prediction',
    title: '俄克拉荷马雷霆会赢得 2027 NBA 总冠军吗？', subtitle: 'NBA 2026–27 赛季总冠军',
    yes: 28, change: -2.1, volume: '¥ 860 万', end: '2027.06.30', source: 'ORACLE / NBA', hot: true,
    spark: [32, 35, 30, 33, 31, 28, 30, 27, 29, 28],
  },
  {
    id: 'lol-worlds', category: 'esports', categoryLabel: '电子竞技', eyebrow: '比赛预测 / LOL', kind: 'prediction',
    title: 'T1 会赢得 2026 英雄联盟全球总决赛吗？', subtitle: '以 Riot Games 官方赛果为准',
    yes: 34, change: 5.1, volume: '¥ 580 万', end: '2026.11.15', source: 'DATA / RIOT GAMES', hot: true,
    spark: [23, 25, 28, 26, 30, 31, 29, 32, 33, 34],
  },
  {
    id: 'valorant-masters', category: 'esports', categoryLabel: '电子竞技', eyebrow: '比赛预测 / VALORANT', kind: 'prediction',
    title: '中国战队会进入 2026 Valorant Masters 决赛吗？', subtitle: '以 VCT 官方赛事结果为准',
    yes: 41, change: -2.6, volume: '¥ 240 万', end: '2026.10.31', source: 'DATA / VCT', hot: false,
    spark: [45, 46, 44, 47, 43, 42, 44, 40, 42, 41],
  },
  {
    id: 'ai-agent', category: 'tech', categoryLabel: '科技趋势', eyebrow: '趋势预测 / AI', kind: 'prediction',
    title: '到 2027 年，AI Agent 是否会成为企业默认工作流？', subtitle: '以 Fortune 500 企业公开部署为观察范围',
    yes: 71, change: 8.3, volume: '¥ 1,120 万', end: '2027.12.31', source: 'ORACLE / PUBLIC DATA', hot: true,
    spark: [48, 51, 49, 56, 59, 57, 63, 65, 68, 71],
  },
  {
    id: 'fed-cuts', category: 'macro', categoryLabel: '宏观经济', eyebrow: '经济预测 / FED', kind: 'prediction',
    title: '美联储会在 2026 年 9 月前降息两次或以上吗？', subtitle: '基于 FOMC 目标利率区间变化',
    yes: 46, change: -0.7, volume: '¥ 540 万', end: '2026.09.30', source: 'ORACLE / FED', hot: false,
    spark: [52, 50, 51, 48, 49, 46, 44, 47, 45, 46],
  },
  {
    id: 'eth-etf', category: 'crypto', categoryLabel: '加密货币', eyebrow: '市场预测 / ETH ETF', kind: 'prediction',
    title: '以太坊现货 ETF 资产规模会在年内超过 $100 亿吗？', subtitle: '以各发行方披露的净资产值合计为准',
    yes: 39, change: 3.5, volume: '¥ 360 万', end: '2026.12.31', source: 'ORACLE / SEC FILINGS', hot: false,
    spark: [30, 33, 31, 35, 34, 37, 36, 40, 38, 39],
  },
  {
    id: 'wc-final', category: 'sports', categoryLabel: '体育赛事', eyebrow: '比赛预测 / FOOTBALL', kind: 'prediction',
    title: '2026 世界杯决赛会出现加时赛吗？', subtitle: '90 分钟常规时间结束时比分平局',
    yes: 22, change: 1.4, volume: '¥ 720 万', end: '2026.07.19', source: 'ORACLE / FIFA', hot: false,
    spark: [18, 20, 19, 21, 23, 22, 20, 21, 22, 22],
  },
  {
    id: 'open-model', category: 'tech', categoryLabel: '科技趋势', eyebrow: '趋势预测 / OPEN SOURCE', kind: 'prediction',
    title: '开源模型会在 2026 年底占据过半开发者使用量吗？', subtitle: '以公开开发者调研和下载趋势综合判断',
    yes: 58, change: 6.9, volume: '¥ 410 万', end: '2026.12.31', source: 'ORACLE / SURVEYS', hot: false,
    spark: [37, 40, 41, 45, 44, 49, 50, 54, 56, 58],
  },
  {
    id: 'china-gdp', category: 'macro', categoryLabel: '宏观经济', eyebrow: '经济预测 / CHINA', kind: 'prediction',
    title: '中国 2026 年 GDP 增速会达到 5% 或以上吗？', subtitle: '以国家统计局最终发布数据为准',
    yes: 35, change: -3.4, volume: '¥ 280 万', end: '2027.03.31', source: 'ORACLE / NBS', hot: false,
    spark: [43, 42, 40, 39, 41, 38, 36, 37, 35, 35],
  },
]

export const leaderboard = [
  { rank: 1, name: '北极星_07', avatar: '北', return: '+42.80%', score: '¥ 14,280', accent: 'gold' },
  { rank: 2, name: '预测员 K', avatar: '预', return: '+36.40%', score: '¥ 13,640', accent: 'silver' },
  { rank: 3, name: 'M42', avatar: 'M', return: '+31.25%', score: '¥ 13,125', accent: 'bronze' },
  { rank: 4, name: '潮汐锁定', avatar: '潮', return: '+27.90%', score: '¥ 12,790' },
  { rank: 5, name: '市场来信', avatar: '市', return: '+24.10%', score: '¥ 12,410' },
]
