export const categories = [
  { id: 'all', label: '全部市场', count: 24 },
  { id: 'crypto', label: '加密资产', count: 8 },
  { id: 'sports', label: '体育赛事', count: 6 },
  { id: 'tech', label: '科技趋势', count: 5 },
  { id: 'macro', label: '宏观世界', count: 5 },
]

export const markets = [
  {
    id: 'btc-150k', category: 'crypto', categoryLabel: '加密资产', eyebrow: '价格观测 / BTC',
    title: '比特币会在 2026 年底前触及 $150,000 吗？', subtitle: '以 Coinbase BTC-USD 现货指数为准',
    yes: 63, change: 4.8, volume: '¥ 2,480 万', end: '2026.12.31', source: 'ORACLE / COINBASE', hot: true,
    spark: [42, 45, 44, 49, 47, 52, 54, 51, 58, 63],
  },
  {
    id: 'nba-finals', category: 'sports', categoryLabel: '体育赛事', eyebrow: '赛季预测 / NBA',
    title: '俄克拉荷马雷霆会赢得 2027 NBA 总冠军吗？', subtitle: 'NBA 2026–27 赛季总冠军',
    yes: 28, change: -2.1, volume: '¥ 860 万', end: '2027.06.30', source: 'ORACLE / NBA', hot: true,
    spark: [32, 35, 30, 33, 31, 28, 30, 27, 29, 28],
  },
  {
    id: 'ai-agent', category: 'tech', categoryLabel: '科技趋势', eyebrow: '产业观测 / AI',
    title: '到 2027 年，AI Agent 是否会成为企业默认工作流？', subtitle: '以 Fortune 500 企业公开部署为观察范围',
    yes: 71, change: 8.3, volume: '¥ 1,120 万', end: '2027.12.31', source: 'ORACLE / PUBLIC DATA', hot: true,
    spark: [48, 51, 49, 56, 59, 57, 63, 65, 68, 71],
  },
  {
    id: 'fed-cuts', category: 'macro', categoryLabel: '宏观世界', eyebrow: '利率观测 / FED',
    title: '美联储会在 2026 年 9 月前降息两次或以上吗？', subtitle: '基于 FOMC 目标利率区间变化',
    yes: 46, change: -0.7, volume: '¥ 540 万', end: '2026.09.30', source: 'ORACLE / FED', hot: false,
    spark: [52, 50, 51, 48, 49, 46, 44, 47, 45, 46],
  },
  {
    id: 'eth-etf', category: 'crypto', categoryLabel: '加密资产', eyebrow: '监管观测 / ETH',
    title: '以太坊现货 ETF 资产规模会在年内超过 $100 亿吗？', subtitle: '以各发行方披露的净资产值合计为准',
    yes: 39, change: 3.5, volume: '¥ 360 万', end: '2026.12.31', source: 'ORACLE / SEC FILINGS', hot: false,
    spark: [30, 33, 31, 35, 34, 37, 36, 40, 38, 39],
  },
  {
    id: 'wc-final', category: 'sports', categoryLabel: '体育赛事', eyebrow: '赛季预测 / FOOTBALL',
    title: '2026 世界杯决赛会出现加时赛吗？', subtitle: '90 分钟常规时间结束时比分平局',
    yes: 22, change: 1.4, volume: '¥ 720 万', end: '2026.07.19', source: 'ORACLE / FIFA', hot: false,
    spark: [18, 20, 19, 21, 23, 22, 20, 21, 22, 22],
  },
  {
    id: 'open-model', category: 'tech', categoryLabel: '科技趋势', eyebrow: '产业观测 / OPEN SOURCE',
    title: '开源模型会在 2026 年底占据过半开发者使用量吗？', subtitle: '以公开开发者调研和下载趋势综合判断',
    yes: 58, change: 6.9, volume: '¥ 410 万', end: '2026.12.31', source: 'ORACLE / SURVEYS', hot: false,
    spark: [37, 40, 41, 45, 44, 49, 50, 54, 56, 58],
  },
  {
    id: 'china-gdp', category: 'macro', categoryLabel: '宏观世界', eyebrow: '经济观测 / CHINA',
    title: '中国 2026 年 GDP 增速会达到 5% 或以上吗？', subtitle: '以国家统计局最终发布数据为准',
    yes: 35, change: -3.4, volume: '¥ 280 万', end: '2027.03.31', source: 'ORACLE / NBS', hot: false,
    spark: [43, 42, 40, 39, 41, 38, 36, 37, 35, 35],
  },
]

export const leaderboard = [
  { rank: 1, name: '北极星_07', avatar: '北', return: '+42.80%', score: '¥ 14,280', accent: 'gold' },
  { rank: 2, name: '观测员 K', avatar: '观', return: '+36.40%', score: '¥ 13,640', accent: 'silver' },
  { rank: 3, name: 'M42', avatar: 'M', return: '+31.25%', score: '¥ 13,125', accent: 'bronze' },
  { rank: 4, name: '潮汐锁定', avatar: '潮', return: '+27.90%', score: '¥ 12,790' },
  { rank: 5, name: '火星来的信', avatar: '火', return: '+24.10%', score: '¥ 12,410' },
]
