const rows = [
  ['evo','baccarat-1','经典百家乐','casino','百家乐','热门','EVOLUTION'],
  ['evo','speed-baccarat','极速百家乐','casino','多台','热门','EVOLUTION'],
  ['evo','dragon-tiger','龙虎争霸','casino','龙虎','新品','EVOLUTION'],
  ['evo','roulette','法式轮盘','casino','轮盘','推荐','EVOLUTION'],
  ['ag','baccarat-1','经典百家乐','casino','百家乐','热门','AG LIVE'],
  ['ag','sicbo','骰宝大厅','casino','骰宝','推荐','AG LIVE'],
  ['ag','road-table','好路桌台','casino','好路','热门','AG LIVE'],
  ['sa','game-show','幸运真人秀','casino','真人秀','新品','SA GAMING'],
  ['sa','multi-table','多台竞技','casino','多台','推荐','SA GAMING'],
  ['jdb','fishing','深海捕鱼','board','捕鱼','热门','JDB'],
  ['jdb','mahjong','欢乐麻将','board','麻将','推荐','JDB'],
  ['jdb','poker','德州扑克','board','扑克','热门','JDB'],
  ['jdb','niuniu','欢乐牛牛','board','牛牛','新品','JDB'],
  ['ky','fishing','金鲨捕鱼','board','捕鱼','推荐','KY'],
  ['ky','mahjong','极速麻将','board','麻将','热门','KY'],
  ['ky','hundred','百人牌局','board','百人','推荐','KY'],
  ['ky','arcade','街机竞技','board','其他','新品','KY'],
  ['pg','fortune-tiger','幸运之虎','slots','冒险','热门','PG SOFT'],
  ['pg','golden-empire','黄金帝国','slots','宝藏','新品','PG SOFT'],
  ['pg','lucky-rabbit','福兔迎春','slots','幸运','推荐','PG SOFT'],
  ['jdb','golden-dragon','金龙传说','slots','神话','热门','JDB'],
  ['jdb','space-odyssey','星际奥德赛','slots','太空','新品','JDB'],
  ['pp','gates-of-sun','太阳之门','slots','神话','热门','PRAGMATIC'],
  ['pp','wild-safari','狂野草原','slots','自然','推荐','PRAGMATIC'],
  ['demo-esports','esports-stage','电竞赛场演示','esports','赛场','演示','竞界原创'],
]
export const games = rows.map(([providerId,id,name,type,category,tag,provider], index) => ({
  providerId,id,name,type,category,tag,provider,
  cover: index % 7,
  rtp: type === 'slots' ? [96.3,95.8,97.1,96.7,95.5,96.1,96.8][index % 7] : null,
  volatility: type === 'slots' ? ['高','中','低'][index % 3] : null,
  lines: type === 'slots' ? [20,25,50][index % 3] : null,
  jackpot: type === 'slots' && index % 3 === 0 ? 128000 + index * 9600 : null,
  oddsHeat: type === 'slots' ? [57,86,41,93,64,72,35][index % 7] : null,
  table: type === 'casino' ? `${String(index + 1).padStart(2,'0')}号桌` : null,
  speed: type === 'casino' ? (name.includes('极速') || name.includes('多台') ? '极速' : '经典') : null,
  roadStyle: type === 'casino' ? (index % 2 ? '庄路' : '闲路') : null,
  available: !(providerId === 'sa' && id === 'game-show'),
}))
export const providers = [...new Set(games.map((game) => game.provider))]
export function filterGames({ type, category, providerId, query = '', tag } = {}) {
  const search = query.trim().toLocaleLowerCase()
  return games.filter((game) => (!type || game.type === type) && (!category || category === '全部' || game.category === category) && (!providerId || game.providerId === providerId) && (!tag || tag === '全部' || game.tag === tag) && (!search || [game.name,game.provider,game.category].some((part) => part.toLocaleLowerCase().includes(search))))
}
export function getGame(providerId, id) { return games.find((game) => game.providerId === providerId && game.id === id) }
export function rankSlotGames(items, category) {
  const ranked = [...items]
  if (category === '热赔率') return ranked.sort((a,b) => b.oddsHeat-a.oddsHeat)
  if (category === '冷赔率') return ranked.sort((a,b) => a.oddsHeat-b.oddsHeat)
  if (category === '最高回报') return ranked.sort((a,b) => b.rtp-a.rtp)
  return ranked
}
